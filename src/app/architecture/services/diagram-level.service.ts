import {Injectable} from '@angular/core';
import * as go from 'gojs';
import {endPointTypes, layers, Node, nodeCategories} from '@app/architecture/store/models/node.model';
import {linkCategories, RoutesEntityEntity} from '@app/architecture/store/models/node-link.model';
import * as uuid from 'uuid/v4';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {State as ArchitectureState} from '@app/architecture/store/reducers/architecture.reducer';
import {Location} from '@angular/common';
import {SetViewLevel} from '@app/architecture/store/actions/view.actions';
import {NodeToolTips} from '@app/core/node-tooltips';
import {UpdateQueryParams} from '@app/core/store/actions/route.actions';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';

const $ = go.GraphObject.make;

// Levels in the diagram
export enum Level {
  system = 'system',
  data = 'data',
  dimension = 'dimension',
  reportingConcept = 'reporting concept',
  systemMap = 'system map',
  dataMap = 'data map',
  dimensionMap = 'dimension map',
  attribute = 'attribute',
  usage = 'usage analysis'
}

// Numbers associated to each level in the data store
export const viewLevelNum = {
  [Level.system]: 1,
  [Level.data]: 2,
  [Level.dimension]: 3,
  [Level.reportingConcept]: 4,
  [Level.attribute]: 5,
  [Level.systemMap]: 8,
  [Level.dataMap]: 9,
  [Level.usage]: 10
};

export const lessDetailOrderMapping = {
  [Level.reportingConcept]: Level.dimension,
  [Level.dimension]: Level.data,
  [Level.systemMap]: Level.system,
  [Level.dataMap]: Level.data,
  [Level.dimensionMap]: Level.dimension,
  [Level.data]: Level.system
};

export const moreDetailOrderMapping = {
  [Level.system]: Level.data,
  [Level.data]: Level.dimension,
  [Level.dimension]: Level.reportingConcept
};

const mapViewLinkLayers = {
  [Level.systemMap]: layers.data,
  [Level.dataMap]: layers.dimension,
  [Level.dimensionMap]: layers.reportingConcept
};

// Define custom layout for top level nodes in map view
function MapViewLayout() {
  go.Layout.call(this);
}
go.Diagram.inherit(MapViewLayout, go.Layout);

MapViewLayout.prototype.doLayout = function(coll: go.Diagram | go.Group | go.Iterable<go.Part>): void {
  const allParts = this.collectParts(coll);

  // Lists of source groups, target groups and transformation nodes
  const sourceGroups = new go.List<go.Group>();
  const targetGroups = new go.List<go.Group>();
  const transformationNodes = new go.List<go.Node>();

  // Populate node lists
  allParts.each(function(part: go.Part) {
    if (part.data.endPointType === endPointTypes.source) {
      sourceGroups.add(part as go.Group);
    } else if (part.data.endPointType === endPointTypes.target) {
      targetGroups.add(part as go.Group);
    } else if (part.category === nodeCategories.transformation && !part.data.isTemporary) {
      transformationNodes.add(part as go.Node);
    }
  });

  this.diagram.startTransaction('Map View Layout');

  // Set initial location to place nodes as the origin
  const nextLocation = new go.Point(0, 0);

  // Sort source groups so that groups without any linked members appear at the bottom
  sourceGroups.sort(function(a: go.Group, b: go.Group): number {
    const aLinks = a.findExternalLinksConnected().count;
    const bLinks = b.findExternalLinksConnected().count;

    if (aLinks === 0 && bLinks !== 0) {
      return 1;
    } else if (bLinks === 0 && aLinks !== 0) {
      return -1;
    } else {
      return 0;
    }
  });

  // Place source groups in a descending list
  sourceGroups.each(function(source: go.Group): void {
    source.move(nextLocation.copy(), true);
    // Set location of next source group to be below the previously set group with a small gap
    nextLocation.offset(0, source.actualBounds.height + 15);
  });

  // Function to return the number of member nodes connected between a given source and target group.
  //   Includes member nodes directly linked as well as nodes connected through a transformation node
  function countConnections(source: go.Group, target: go.Group): number {
    // Initialise connections count
    let totalConnections = 0;
    // For each node linked to a target member node...
    target.findExternalNodesConnected().each(function(node: go.Node): void {
      // ...if node is a member of the source group then increment count of connections
      if (node.containingGroup && node.containingGroup.key === source.key) {
        totalConnections++;
        // ...if node is transformation node then increase connection count by number of linked source group members
      } else if (node.category === nodeCategories.transformation) {
        node.findNodesInto().each(function(node2: go.Node): void {
          if (node2.containingGroup && node2.containingGroup.key === source.key) {
            totalConnections++;
          }
        });
      }
    });
    return totalConnections;
  }

  // Sort target groups according to number of connections to each source group
  targetGroups.sort(function(a: go.Group, b: go.Group): number {

    // Sort by connections to first source group, then each subsequent source group in order
    for (let i = 0; i < sourceGroups.count; i++) {
      const sourceGroup = sourceGroups.elt(i);

      const aLinks = countConnections(sourceGroup, a);
      const bLinks = countConnections(sourceGroup, b);

      // If one target group has more connections then use this to order them.
      //   Otherwise, continue and attempt to order using connections to subsequent source group.
      if (aLinks !== bLinks) {
        return bLinks - aLinks;
      }
    }

    // If both target groups have equal numbers of connections to all source groups
    //   then neither group has priority in ordering
    return 0;
  });

  // Set initial location for target groups.
  // Place to the right of source groups.
  nextLocation.setTo(600, 0);

  // Place target groups in a descending list
  targetGroups.each(function(target: go.Group): void {
    target.move(nextLocation.copy(), true);
    // Set location of next target group to be below the previously set group with a small gap
    nextLocation.offset(0, target.actualBounds.height + 15);
  });

  // Sort transformation nodes depending on vertical distance of linked nodes
  transformationNodes.sort(function(a: go.Node, b: go.Node): number {

    // Function to return average height of nodes linked to the given node
    function getAverageLinkedHeight(node) {
      let totalLinkedHeight = 0;
      // Sum the Y co-ordinate values of connected nodes
      node.findNodesConnected().each(function(connectedNode: go.Node) {
        totalLinkedHeight += connectedNode.location.y;
      });
      // Divide total by number of connections to work out the average
      return totalLinkedHeight / node.findNodesConnected().count;
    }

    const averageHeightA = getAverageLinkedHeight(a);
    const averageHeightB = getAverageLinkedHeight(b);

    // Sort based on difference between the averages for the two nodes
    return averageHeightA - averageHeightB;
  });

  // Calculate suitable gap between transformation nodes to ensure an even spread
  //    Determine available vertical space adjacent to the source and target groups
  const lowestGroupPoint = Math.max(
    // Set to 0 in case no source or target groups found
    sourceGroups.last() ? sourceGroups.last().actualBounds.bottom : 0,
    targetGroups.last() ? targetGroups.last().actualBounds.bottom : 0
  );
  //    Get a suitable gap between each node based on available space and number of transformation nodes
  const step = lowestGroupPoint / (transformationNodes.count + 1);

  // Set initial location for transformation nodes.
  // Place in between source and target groups.
  nextLocation.setTo(300, step - 27);

  transformationNodes.each(function(trans: go.Node): void {
    trans.move(nextLocation.copy(), true);
    // Set location of the next node to be below the previous node, separated by the predetermined gap
    nextLocation.offset(0, step);
  });

  this.diagram.commitTransaction('Map View Layout');
};
// End map view layout

@Injectable()
export class DiagramLevelService {
  historyOfFilters: any = {};

  groupLayoutInitial = true;

  // Filter to apply to nodes for the diagram
  //    filterLevel: level to apply the filter to
  //    filterNodeIds: array of node Ids specified for inclusion
  filter: BehaviorSubject<{
    filterLevel: Level;
    filterNodeIds?: string[];
  }> = new BehaviorSubject({ filterLevel: Level.system });

  filterSubscription: Subscription;
  filterServiceSubscription: Subscription;

  // Observable to track nodes needed for the palette
  private paletteNodesSource = new BehaviorSubject([]);
  paletteNodes = this.paletteNodesSource.asObservable();

  private paletteLinksSource = new BehaviorSubject([]);
  paletteLinks = this.paletteLinksSource.asObservable();

  constructor(private store: Store<ArchitectureState>, public location: Location) {}

  public initializeUrlFiltering(): void {
    this.filterSubscription = this.filter.subscribe(filter => {
      this.store.dispatch(new SetViewLevel(filter.filterLevel));
      if (!filter.filterNodeIds && filter.filterLevel === Level.system) {
        this.historyOfFilters = {};
      }
      this.historyOfFilters[filter.filterLevel] = {
        ...(filter.filterNodeIds && { filterNodeIds: filter.filterNodeIds })
      };
    });

    this.filterServiceSubscription = this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => {
      if (filterLevel) {
        return this.filter.next({ filterLevel: filterLevel });
      }
      return this.filter.next({ filterLevel: Level.system });
    });
  }

  // Display the next level of detail in the diagram, filtered to include only children of a specific node
  //    object: node to display the children of
  changeLevelWithFilter(_event: any, object: go.Node): void {
    let newLevel: Level;
    if (object.data.layer === layers.system) {
      newLevel = Level.data;
    } else if (object.data.layer === layers.data) {
      newLevel = Level.dimension;
    } else if (object.data.layer === layers.dimension) {
      newLevel = Level.reportingConcept;
    } else {
      return;
    }
    this.store.dispatch(
      new UpdateQueryParams({ filterLevel: newLevel, id: object.data.id, parentName: object.data.name })
    );
  }

  displayGroupMembers(_event: any, object: go.Node) {
    this.store.dispatch(
      new UpdateQueryParams({ filterLevel: Level.system, id: object.data.id, groupName: object.data.name })
    );
  }

  displayMapView(event: go.DiagramEvent, object: go.Part): void {
    // Indicate that the initial group layout is being performed and has not yet been completed
    this.groupLayoutInitial = true;

    this.store.dispatch(
      new UpdateQueryParams({
        filterLevel: object.data.layer + ' map',
        id: object.data.id,
        parentName: object.data.name,
        isTransformation: object instanceof go.Node
      })
    );

    // Ensure that diagram content is initially centered while layouts are performed
    event.diagram.contentAlignment = go.Spot.Center;
  }

  // Perform layout for groups that nodes belong to
  relayoutGroups(event) {
    event.subject.each(function(node: go.Node) {
      if (node.containingGroup) {
        node.invalidateLayout();
      }
    });
  }

  displayUsageView(event, object) {
    this.store.dispatch(
      new UpdateQueryParams({
        filterLevel: Level.usage,
        id: object.data.id
      })
    );
  }

  public destroyUrlFiltering() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.filterServiceSubscription) {
      this.filterServiceSubscription.unsubscribe();
    }
  }

  getToolTipForMasterDataLinks(level) {
    let tooltip: string;
    if (level === Level.system) {
      tooltip = NodeToolTips[5].Tooltip;
    } else if (level === Level.data || level === Level.systemMap) {
      tooltip = NodeToolTips[8].Tooltip;
    } else if (level === Level.dimension || level === Level.dataMap) {
      tooltip = NodeToolTips[11].Tooltip;
    } else if (level === Level.reportingConcept || level === Level.dimensionMap) {
      tooltip = NodeToolTips[15].Tooltip;
    }
    return tooltip;
  }

  getToolTipForDataLinks(level) {
    let tooltip: string;
    if (level === Level.system) {
      tooltip = NodeToolTips[6].Tooltip;
    } else if (level === Level.data || level === Level.systemMap) {
      tooltip = NodeToolTips[9].Tooltip;
    }
    return tooltip;
  }

  // Change the currently displayed diagram level
  //  params:
  //    diagram: the diagram object
  //    level: the level to change to
  changeLevel(diagram: go.Diagram, level: Level): void {
    // Clear clipboard to prevent parts being copied to the wrong view
    diagram.commandHandler.copyToClipboard(null);

    // Array of nodes to be used in the palette
    const paletteViewNodes = [];

    // Array of links to be used in the palette
    const paletteViewLinks = [];

    const linkLayer = level.endsWith('map') ? mapViewLinkLayers[level] : level.toLowerCase();

    if (level !== Level.usage) {
      paletteViewLinks.push({
        category: linkCategories.masterData,
        id: 'New master data link',
        name: 'New master data link',
        description: '',
        route: <RoutesEntityEntity['points']>[0, 0, 40, 0, 40, -80, 80, -80],
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: this.getToolTipForMasterDataLinks(level)
      });
    }

    if (level !== Level.usage) {

      let transformationLayer;

      if (level === Level.systemMap) {
        transformationLayer = layers.data;
      } else if (level === Level.dataMap) {
        transformationLayer = layers.dimension;
      } else if (level === Level.dimensionMap) {
        transformationLayer = layers.reportingConcept;
      } else {
        transformationLayer = level;
      }

      paletteViewNodes.push(
        new Node({
          id: 'New transformation',
          name: 'New transformation',
          layer: transformationLayer,
          category: nodeCategories.transformation,
          tooltip: NodeToolTips[16].Tooltip,
          isTemporary: level.endsWith('map')
        })
      );
    }

    if (level === Level.system) {
      paletteViewNodes.splice(0, 0,
        new Node({
          id: 'New Transactional System',
          name: 'New Transactional System',
          layer: layers.system,
          category: nodeCategories.transactional,
          tooltip: NodeToolTips[0].Tooltip
        }),
        new Node({
          id: 'New Analytical System',
          name: 'New Analytical System',
          layer: layers.system,
          category: nodeCategories.analytical,
          tooltip: NodeToolTips[1].Tooltip
        }),
        new Node({
          id: 'New File System',
          name: 'New File System',
          layer: layers.system,
          category: nodeCategories.file,
          tooltip: NodeToolTips[2].Tooltip
        }),
        new Node({
          id: 'New Reporting System',
          name: 'New Reporting System',
          layer: layers.system,
          category: nodeCategories.reporting,
          tooltip: NodeToolTips[3].Tooltip
        }),
        new Node({
          id: 'New Master Data System',
          name: 'New Master Data System',
          layer: layers.system,
          category: nodeCategories.masterData,
          tooltip: NodeToolTips[4].Tooltip
        })
      );
    } else if (level === Level.data) {
      paletteViewNodes.splice(0, 0,
        new Node({
          id: 'New Data Structure',
          name: 'New Data Structure',
          layer: layers.data,
          category: nodeCategories.dataStructure,
          tooltip: NodeToolTips[7].Tooltip
        })
      );
    } else if (level === Level.dimension) {
      paletteViewNodes.splice(0, 0,
        new Node({
          id: 'New Dimension',
          name: 'New Dimension',
          layer: layers.dimension,
          category: nodeCategories.dimension,
          tooltip: NodeToolTips[10].Tooltip
        })
      );
    } else if (level === Level.reportingConcept) {
      paletteViewNodes.splice(0, 0,
        new Node({
          id: 'New List Reporting Concept',
          name: 'New List Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.list,
          tooltip: NodeToolTips[12].Tooltip
        }),
        new Node({
          id: 'New Structural Reporting Concept',
          name: 'New Structural Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.structure,
          tooltip: NodeToolTips[13].Tooltip
        }),
        new Node({
          id: 'New Key Reporting Concept',
          name: 'New Key Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.key,
          tooltip: NodeToolTips[14].Tooltip
        })
      );
    }

    if ([Level.system, Level.data, Level.systemMap].includes(level)) {
      paletteViewLinks.push({
        category: linkCategories.data,
        id: 'New data link',
        name: 'New data link',
        description: '',
        route: <RoutesEntityEntity['points']>[0, 0, 40, 0, 40, -80, 80, -80],
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: this.getToolTipForDataLinks(level)
      });
    }

    // In map view, add links connected to the transformation node in the palette
    if (level.endsWith('map')) {
      // Input link to transformation node
      paletteViewLinks.push({
        category: level === Level.systemMap ? linkCategories.data : linkCategories.masterData,
        id: 'New link to transformation',
        name: 'New link to transformation',
        description: '',
        to: 'New transformation',
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: level === Level.systemMap ? this.getToolTipForDataLinks(level) :
          this.getToolTipForMasterDataLinks(level)
      });
      // Output link from transformation node
      paletteViewLinks.push({
        category: level === Level.systemMap ? linkCategories.data : linkCategories.masterData,
        id: 'New link from transformation',
        name: 'New link from transformation',
        description: '',
        from: 'New transformation',
        layer: linkLayer,
        isTemporary: true,
        impactedByWorkPackages: [],
        tooltip: level === Level.systemMap ? this.getToolTipForDataLinks(level) :
          this.getToolTipForMasterDataLinks(level)
      });
    }

    diagram.model = $(go.GraphLinksModel, {
      nodeKeyProperty: level.endsWith('map') ? 'displayId' : 'id',
      linkKeyProperty: level.endsWith('map') ? 'displayId' : 'id',
      nodeCategoryProperty: level.endsWith('map') ?
        function(data) {
          // Ensure systems are represented by map view groups in map view
          return data.layer === layers.system ? '' :
            data.category === nodeCategories.transformation ? nodeCategories.transformation :
              data.layer;
        } :
        function(data) {
          // Ensure that transformation nodes use their own category, separate from the layer
          return data.category === nodeCategories.transformation
            ? nodeCategories.transformation
            : data.layer;
        },
      linkFromKeyProperty: level.endsWith('map') ? 'sourceDisplayId' : level === Level.usage ? 'parentId' : 'sourceId',
      linkToKeyProperty: level.endsWith('map') ? 'targetDisplayId' : level === Level.usage ? 'childId' : 'targetId',
      modelData: diagram.model.modelData,
      // Ensure new key is generated when copying from the palette
      copiesKey: false,
      makeUniqueKeyFunction: function(model: go.Model, data: go.ObjectData) {
        return uuid();
      },
      makeUniqueLinkKeyFunction: function() {
        return uuid();
      }
    });

    diagram.parts.each(function(part) {
      if (part.category === 'lane') {
        diagram.remove(part);
      }
    });

    if (level === Level.usage) {
      this.createNodeUsageLanes(diagram);
    }

    // Settings and layout for map view
    if (level.endsWith('map')) {
      diagram.layout = $(MapViewLayout as any, {
        isInitial: true,
        isOngoing: true
      });

      // Settings and layout for non-map views
    } else {
      diagram.layout = $(go.LayeredDigraphLayout, {
        setsPortSpots: level === Level.usage,
        isOngoing: level === Level.usage, // Prevent rearranging diagram automatically unless in usage view
        isInitial: true,
        aggressiveOption: go.LayeredDigraphLayout.AggressiveMore,
        isRouting: true,
        // Arrange nodes from top down in node usage view
        direction: level === Level.usage ? 90 : 0
      });
    }

    this.paletteNodesSource.next(paletteViewNodes);
    this.paletteLinksSource.next(paletteViewLinks);
  }

  // Create parts to represent swim lanes to indicate layers when in node usage view
  createNodeUsageLanes(diagram: go.Diagram): void {

    [layers.system,
     layers.data,
     layers.dimension,
     layers.reportingConcept ].forEach(
       function(layer) {
         diagram.add(
           $(go.Part, 'Horizontal',
             {
               selectable: false,
               name: layer,
               category: 'lane',
               locationObjectName: 'shape'
             },
             // Label section of the lane
             $(go.Panel, 'Auto',
               {
                 stretch: go.GraphObject.Vertical,
                 width: 50
               },
               $(go.Shape,
                 {
                   fill: null
                 }
               ),
               $(go.TextBlock,
                 {
                   angle: 270,
                   text: layer,
                   margin: 2,
                   font: '18px ' + getComputedStyle(document.body).getPropertyValue('--default-font')
                 }
               )
             ),
             // Area to enclose nodes from the lane's layer
             $(go.Shape,
               {
                 name: 'shape',
                 fill: null
               }
             )
           )
         );
       }
     );
  }
}
