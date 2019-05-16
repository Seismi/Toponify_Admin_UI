import {Location} from '@angular/common';
import {Injectable, OnDestroy} from '@angular/core';
import {SetViewLevel} from '@app/architecture/store/actions/view.actions';
import {Store} from '@ngrx/store';
import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {BehaviorSubject, Subscription} from 'rxjs';
import * as uuid from 'uuid/v4';
// import { SetMapView } from '@app/version/store/actions/mapview.actions';
import { Node, nodeCategories, layers } from '@app/nodes/store/models/node.model';
import { NodeLink, linkCategories } from '@app/nodes/store/models/node-link.model';
import { FilterService } from '@app/architecture/services/filter.service';
import { State as ArchitectureState} from '@app/architecture/store/reducers/view.reducer';

const $ = go.GraphObject.make;

// Levels in the diagram
export enum Level {
  system = 'System',
  dataSet = 'Data Set',
  dimension = 'Dimension',
  reportingConcept = 'Reporting Concept',
  map = 'Map',
  attribute = 'Attribute'
}

// Customised link that only updates its route when a tool that can affect link route is active
class CustomLink extends go.Link {
  constructor() {
    super();
  }

  // Override computePoints method
  public computePoints(): boolean {

    const toolManager = this.diagram.toolManager;

    // Array of tools that can affect link routes
    const tools = [toolManager.draggingTool,
      toolManager.linkReshapingTool,
      toolManager.linkingTool,
      toolManager.relinkingTool];

    // Always update route if "updateRoute" flag set or no route defined
    if (this.data.updateRoute || this.points.count === 0) {
      // Reset "updateRoute" flag
      this.diagram.model.setDataProperty(this.data, 'updateRoute', false);
      return go.Link.prototype.computePoints.call(this);
    }

    // Leave link route as it is if no tools active and link is not temporary
    if (!tools.some(function(tool) {return tool.isActive; })
      && !this.data.isTemporary) {
      return true;
    }

    // Call standard computePoints method
    return go.Link.prototype.computePoints.call(this);
  }
}

// Default display options, under which parts in the diagram will have their positions saved
export const standardDisplayOptions = {
  name: true,
  description: false,
  tags: true,
  owner: false,
  nextLevel: true,
  responsibilities: false,
  dataLinks: true,
  masterDataLinks: true,
  linkName: false,
  linkLabel: false
};

// Numbers associated to each level in the data store
export const viewLevelNum = {
  [Level.system]: 1,
  [Level.dataSet]: 2,
  [Level.dimension]: 3,
  [Level.reportingConcept]: 4,
  [Level.attribute]: 5,
  [Level.map]: 9
};

const lessDetailOrderMapping = {
  [Level.reportingConcept]: Level.dimension,
  [Level.dimension]: Level.dataSet,
  [Level.map]: Level.dataSet,
  [Level.dataSet]: Level.system
};

const moreDetailOrderMapping = {
  [Level.system]: Level.dataSet,
  [Level.dataSet]: Level.dimension,
  [Level.dimension]: Level.reportingConcept,
};

@Injectable()
export class DiagramService implements OnDestroy {
  colours = {
    Seismi_Blue: '#5B9BD5',
    Faded_Blue: '#BDD0E9',
    FadeGrad: $(go.Brush,
      'Linear', {0: '#d9e4f2',
        1: 'white',
        start: go.Spot.TopLeft,
        end: go.Spot.BottomRight
      }
    )
  };

  historyOfFilters: any = {};

  mapView = null;

  // Indicates whether the default display settings are currently active
  standardDisplay = true;

  // Filter to apply to nodes for the diagram
  //    filterLevel: level to apply the filter to
  //    filterNodeIds: array of node Ids specified for inclusion
  filter: BehaviorSubject<{filterLevel: Level, filterNodeIds?: string[]}> = new BehaviorSubject({filterLevel: Level.system});

  groupLayoutInitial = false;

  // Observable to track nodes needed for the palette
  private paletteNodesSource = new BehaviorSubject([]);
  paletteNodes = this.paletteNodesSource.asObservable();

  private paletteLinksSource = new BehaviorSubject([]);
  paletteLinks = this.paletteLinksSource.asObservable();

  private masterDataTemplateSource = new BehaviorSubject(this.getSystemNodeTemplate());
  masterDataTemplate = this.masterDataTemplateSource.asObservable();

  filterSubscription: Subscription;
  filterServiceSubscription: Subscription;

  constructor(
    private store: Store<ArchitectureState>,
    public filterService: FilterService,
    public location: Location
  ) {
  }

  public initializeUrlFiltering() {

    this.filterSubscription = this.filter.subscribe(filter => {
      this.store.dispatch(new SetViewLevel(viewLevelNum[filter.filterLevel]));
      if (!filter.filterNodeIds && filter.filterLevel === Level.system) {
        this.historyOfFilters = {};
      }
      this.historyOfFilters[filter.filterLevel] = {
        ...(filter.filterNodeIds && {filterNodeIds: filter.filterNodeIds})
      };
    });

    const filterFromQuery = this.filterService.getFilter();
    if (filterFromQuery) {
      this.filter.next(filterFromQuery);
    } else {
      this.filterService.setFilter({filterLevel: Level.system});
    }

    this.filterServiceSubscription = this.filterService.filter.subscribe(filter => {
      if (filter && JSON.stringify(filter) !== JSON.stringify(this.filter.getValue())) {
        this.filter.next(filter);
      }

      if (!filter) {
        this.filter.next({filterLevel: Level.system});
      }
    });
  }

  public destroyUrlFiltering() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.filterServiceSubscription) {
      this.filterServiceSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.destroyUrlFiltering();
  }

  // Change the currently displayed diagram level
  //  params:
  //    diagram: the diagram object
  //    level: the level to change to
  changeLevel(diagram: go.Diagram, level: Level): void {
    // Clear clipboard to prevent parts being copied to the wrong view
    diagram.commandHandler.copyToClipboard(null);

    diagram.nodeTemplateMap.add(nodeCategories.masterData,
      (level === Level.dataSet) ? this.getDataSetNodeTemplate() : this.getSystemNodeTemplate()
    );

    // Array of nodes to be used in the palette
    let paletteViewNodes: object[] = [];

    const paletteViewLinks = [{
      category: linkCategories.masterData,
      id: 'New master data link',
      name: 'New master data link',
      description: '',
      route: [0, 0, 80, -80],
      isTemporary: true
    }];

    if (level === Level.system) {
      paletteViewNodes = [
        new Node({
          id: 'New Transactional System',
          name: 'New Transactional System',
          layer: layers.system,
          category: nodeCategories.transactional
        }),
        new Node({
          id: 'New Analytical System',
          name: 'New Analytical System',
          layer: layers.system,
          category: nodeCategories.analytical
        }),
        new Node({
          id: 'New File System',
          name: 'New File System',
          layer: layers.system,
          category: nodeCategories.file
        }),
        new Node({
          id: 'New Reporting System',
          name: 'New Reporting System',
          layer: layers.system,
          category: nodeCategories.reporting
        }),
        new Node({
          id: 'New Master Data System',
          name: 'New Master Data System',
          layer: layers.system,
          category: nodeCategories.masterData
        })
      ];

    } else if (level === Level.dataSet) {
      paletteViewNodes = [
        new Node({ id: 'New Physical Data Set',
          name: 'New Physical Data Set',
          layer: layers.dataSet,
          category: nodeCategories.physical
        }),
        new Node({ id: 'New Virtual Data Set',
          name: 'New Virtual Data Set',
          layer: layers.dataSet,
          category: nodeCategories.virtual
        }),
        new Node({ id: 'New Master Data Data Set',
          name: 'New Master Data Data Set',
          layer: layers.dataSet,
          category: nodeCategories.masterData
        })
      ];
    } else if (level === Level.dimension || level === Level.map) {

      if (!this.mapView) {
        paletteViewNodes = [
          new Node({ id: 'New Dimension',
            name: 'New Dimension',
            layer: layers.dimension,
            category: nodeCategories.dimension
          })
        ];
      }
    } else if (level === Level.reportingConcept) {
      paletteViewNodes = [
        new Node({ id: 'New List Reporting Concept',
          name: 'New List Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.list
        }),
        new Node({ id: 'New Structural Reporting Concept',
          name: 'New Structural Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.structure
        }),
        new Node({ id: 'New Key Reporting Concept',
          name: 'New Key Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.key
        })
      ];
    }

    if (level === Level.system || level === Level.dataSet ) {
      paletteViewLinks.push({
        category: linkCategories.data,
        id: 'New data link',
        name: 'New data link',
        description: '',
        route: [0, 0, 80, -80],
        isTemporary: true
      });
    }

    diagram.model = $(go.GraphLinksModel, {
      nodeKeyProperty: 'id',
      linkKeyProperty: 'id',
      linkFromKeyProperty: 'sourceId',
      linkToKeyProperty: 'targetId',
      modelData: diagram.model.modelData,
      // Ensure new key is generated when copying from the palette
      copiesKey: false,
      makeUniqueKeyFunction: function() {return uuid(); },
      makeUniqueLinkKeyFunction: function() {return uuid(); }
    });


    // Settings and layout for map view
    if (level === Level.map) {
      diagram.layout =  $(go.GridLayout, {
        spacing: new go.Size(100, 100),
        alignment: go.GridLayout.Position,
        wrappingWidth: Infinity,
        isInitial: true,
        isOngoing: true
      });

      // Settings and layout for non-map views
    } else {
      this.mapView = null;

      diagram.layout = $(go.LayeredDigraphLayout, {
        setsPortSpots: false,
        isOngoing: false, // Prevent rearranging diagram automatically
        isInitial: true,
        aggressiveOption: go.LayeredDigraphLayout.AggressiveMore,
        isRouting: true
      });
    }

    this.masterDataTemplateSource.next((level === Level.dataSet) ?
      this.getDataSetNodeTemplate() :
      this.getSystemNodeTemplate()
    );

    this.paletteNodesSource.next(paletteViewNodes);
    this.paletteLinksSource.next(paletteViewLinks);
  }

  // Display the next level of detail in the diagram, filtered to include only children of a specific node
  //    object: node to display the children of
  changeLevelWithFilter(event: any, object: go.Node): void {
    let newLevel: Level;

    if ([nodeCategories.transactional,
      nodeCategories.analytical,
      nodeCategories.file,
      nodeCategories.reporting,
      nodeCategories.masterData].includes(object.data.category)) {
      newLevel = Level.dataSet;
    } else if ([nodeCategories.physical, nodeCategories.virtual, nodeCategories.masterData].includes(object.data.category)) {
      newLevel = Level.dimension;
    } else if (object.data.category === nodeCategories.dimension) {
      newLevel = Level.reportingConcept;
    } else {
      return;
    }
    const childIds = object.data.descendants.map(function (child) {
      return child.id;
    });

    this.filterService.setFilter({filterLevel: newLevel, filterNodeIds:  childIds});
  }

  displayMapView(event: any, object: go.Link): void {

    // Do not display map view for data links without detail available
    if (!(object.data.category === linkCategories.data)) {
      return;
    }

    const linkId = object.data.id;

    // Indicate that the initial group layout is being performed and has not yet been completed
    this.groupLayoutInitial = true;

    this.filterService.setFilter({filterLevel: Level.map});

    const fromNode = JSON.parse(JSON.stringify(object.fromNode.data));
    const toNode = JSON.parse(JSON.stringify(object.toNode.data));

    fromNode.isGroup = true;
    toNode.isGroup = true;

    this.mapView = {
      sourceModel: fromNode,
      targetModel: toNode
    };

    // Ensure that diagram content is initially centered while layouts are performed
    event.diagram.contentAlignment = go.Spot.Center;
    // this.store.dispatch(new SetMapView(linkId));
  }

  // Perform layout for groups that nodes belong to
  relayoutGroups(event) {
    event.subject.each(function(node: go.Node) {
      if (node.containingGroup) {
        node.invalidateLayout();
      }
    });
  }

  // Context menu for when the background is right-clicked
  getBackgroundContextMenu(): go.Adornment {

    // Standard highlighting for buttons when mouse cursor enters them
    function standardMouseEnter(e: object, btn: go.Part): void {
      if (!btn.isEnabledObject()) {
        return;
      }
      const shape = btn.findObject('ButtonBorder'); // the border Shape
      if (shape instanceof go.Shape) {
        let brush = btn['_buttonFillOver'];
        btn['_buttonFillNormal'] = shape.fill;
        shape.fill = brush;
        brush = btn['_buttonStrokeOver'];
        btn['_buttonStrokeNormal'] = shape.stroke;
        shape.stroke = brush;
      }
    }

    // Ordinary button for context menu
    function makeButton(
      row: number,
      text: string,
      action: (event: object, object?: go.Part) => void,
      visible_predicate?: (object: go.Part, event: object) => boolean
    ): go.Part {
      return $(
        'ContextMenuButton',
        $(go.TextBlock, text),
        {
          click: action,
          name: text,
          column: 0,
          row: row,
          mouseEnter: function(event: object, object: go.Part) {
            standardMouseEnter(event, object);
            // Hide any open submenu when user mouses over button
            object.part.elements.each(function(button: go.Part) {
              if (button.column === 1) {
                button.visible = false;
              }
            });
          }
        },
        // Don't bother with binding GraphObject.visible if there's no predicate
        visible_predicate
          ? new go.Binding('visible', '', function(
              object: go.Part,
              event: object
            ): boolean {
              if (object.diagram) {
                return visible_predicate(object, event);
              } else {
                return false;
              }
            }).ofObject()
          : {}
      );
    }

    // Button to appear when a menu button is moused over
    function makeSubMenuButton(
      row: number,
      text: string,
      action: (event: object, object?: go.Part) => void,
      enabled_predicate?: (object: go.Part, event: object) => boolean
    ): go.Part {
      return $('ContextMenuButton', $(go.TextBlock, text), {
        click: action,
        name: text,
        visible: false,
        column: 1,
        row: row
      },
        enabled_predicate
          ? new go.Binding('isEnabled', '', enabled_predicate)
          : {}
      );
    }

    // Button to show a submenu when moused over
    function makeMenuButton(
      row: number,
      text: string,
      subMenuNames: string[],
      visible_predicate?: (object: go.Part, event: object) => boolean
    ): go.Part {
      return $(
        'ContextMenuButton',
        $(go.TextBlock, text),
        {
          mouseEnter: function(event: object, object: go.Part): void {
            standardMouseEnter(event, object);
            // Hide any open submenu that is already open
            object.part.elements.each(function(button: go.Part): void {
              if (button.column === 1) {
                button.visible = false;
              }
            });
            // Show any submenu buttons assigned to this menu button
            subMenuNames.forEach(function(buttonName: string): void {
              object.part.findObject(buttonName).visible = true;
            });
          },
          column: 0,
          row: row
        },
        // Don't bother with binding GraphObject.visible if there's no predicate
        visible_predicate
          ? new go.Binding('visible', '', function(
              object: go.Part,
              event: object
            ): boolean {
              if (object.diagram) {
                return visible_predicate(object, event);
              } else {
                return false;
              }
            }).ofObject()
          : {}
      );
    }

    return $(
      go.Adornment,
      'Table',
      makeButton(0, 'Edit', function(event: any): void {
        /*Placeholder*/
      }),
      makeButton(1, 'Cut', function(event: object): void {
        /*Placeholder*/
      }),
      makeButton(2, 'Copy', function(event: object): void {
        /*Placeholder*/
      }),
      makeButton(3, 'Paste', function(event: object): void {
        /*Placeholder*/
      }),
      makeMenuButton(4, 'Level', ['More detail', 'Less detail']),
      // --Level submenu buttons--
      makeSubMenuButton(
        4,
        'More detail',
        function(event: any, object: any): void {
          const filterLevel = moreDetailOrderMapping[this.filter.getValue().filterLevel];
          if (filterLevel) {
            this.filterService.setFilter({filterLevel: filterLevel});
          }
        }.bind(this),
        function(object: go.Part, event: object): boolean {
          return (object as any).nodeDataArray.length > 0 && this.filter.getValue().filterLevel !== Level.reportingConcept && !this.mapView;
        }.bind(this)
      ),
      makeSubMenuButton(
        5,
        'Less detail',
        function(event: any, object: any): void {
          const filterLevel = lessDetailOrderMapping[this.filter.getValue().filterLevel];
          if (filterLevel) {
            let filter = { filterLevel: filterLevel };
            if (this.historyOfFilters[filterLevel]) {
              filter = {
                filterLevel: filterLevel,
                ...(this.historyOfFilters[filterLevel].filterNodeIds && {filterNodeIds: this.historyOfFilters[filterLevel].filterNodeIds})
              };
            }
            this.filterService.setFilter(filter);
          } else {
            this.filterService.setFilter({filterLevel: Level.system});
          }
        }.bind(this)
      ),
      // --End of level submenu buttons--
      makeMenuButton(5, 'Comment', [
        'New Risk',
        'New Assumption',
        'New Dependency',
        'New Issue',
        'New Opportunity',
        'Other note'
      ]),
      // --Comment submenu buttons--
      makeSubMenuButton(5, 'New Risk', function(event: object): void {
        /*Placeholder*/
      }),
      makeSubMenuButton(6, 'New Assumption', function(event: object): void {
        /*Placeholder*/
      }),
      makeSubMenuButton(7, 'New Dependency', function(event: object): void {
        /*Placeholder*/
      }),
      makeSubMenuButton(8, 'New Issue', function(event: object): void {
        /*Placeholder*/
      }),
      makeSubMenuButton(9, 'New Opportunity', function(event: object): void {
        /*Placeholder*/
      }),
      makeSubMenuButton(10, 'Other note', function(event: object): void {
        /*Placeholder*/
      }),
      // --End of comment submenu buttons--
      makeButton(6, 'Filter', function(event: object): void {
        /*Placeholder*/
      }),
      makeButton(7, 'Delete', function(event: object): void {
        /*Placeholder*/
      })
    );
  }

  linkingValidation(fromnode: go.Node, fromport: go.GraphObject, tonode: go.Node, toport: go.GraphObject, oldlink: go.Link) {

    // Only validate links that are connected at both ends
    if (!fromnode || !tonode) {
      return true;
    }

    // If both nodes linked are from a group, then ensure the nodes are not part of the same group
    if (fromnode.containingGroup && tonode.containingGroup) {
      if (fromnode.containingGroup.key === tonode.containingGroup.key) {
        return false;
      }
    }

    // When connecting links via drag and drop, the oldlink parameter is not passed.
    // Therefore, set the value of this parameter here in this case.
    if (!oldlink) {

      const draggingTool = fromnode.diagram.toolManager.draggingTool;

      // Copy of a link being created
      if (draggingTool.copiedParts) {
        oldlink = draggingTool.copiedParts.first().key as go.Link;
      } else {  // Link being moved
        oldlink = draggingTool.draggedParts.first().key as go.Link;
      }
    }

    // Only validate master data links
    if (oldlink.category === linkCategories.masterData) {
      // Prevent multiple master data links between the same pair of nodes
      const allLinks = fromnode.findLinksBetween(tonode);
      return !allLinks.any(function (link) {
        return (link.data.category === linkCategories.masterData
          // Don't count current link when checking if master data links already exist
          && oldlink.data.id !== link.data.id);
      });
    }

    return true;
  }

  // Add newly created nodes to the back end
  //  -event
  //    -subject: set of nodes to add to the database
  createObjects(event: any): void {

    const currentLevel = this.filter.getValue().filterLevel;

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

    event.subject.each(function(part: go.Part) {

      // Only add nodes here as new links are temporary until connected
      if (part instanceof go.Node) {

        // Create copy of node data with route in format required for back end
        const sendData = Object.assign({}, part.data);

        // Replace locations. Will need to be updated to replace individual location for the current view when views are implemented.
        // *REPLACE* sendData.location = [{view: 'Default', locationCoordinates: part.data.location}];

        // Add node to back end database
        /* *REPLACE*
        this.store.dispatch(new addNodeActionMapping[currentLevel]({
          [currentLevel.toLowerCase()]: {
            data: sendData
          },
          versionId: this.versionId
        }));*/
      }
    }.bind(this));
  }

  // Update position of links or nodes in the back end
  //  -event
  //    -subject: set of parts to update the positions of
  updatePosition(event: any): void {

    const currentLevel = this.filter.getValue().filterLevel;

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

    // Set to contain all parts to update
    const partsToUpdate = new go.Set();

    // Moving a node will affect the positions of connected links.
    //  Therefore, add any connected links to set of parts to update.
    event.subject.each(function(part: go.Part) {
      partsToUpdate.add(part);

      if (part instanceof go.Node) {
        partsToUpdate.addAll(part.linksConnected);
      }
    });

    const links: any[] = [];

    // Update position of each part
    partsToUpdate.each(function(part: go.Part) {

      if (part instanceof go.Link) {
        // Ignore disconnected links
        if (part.fromNode && part.toNode) {

          // Replace routes. Will need to be updated to replace individual route for the current view when views are implemented.
          /* *REPLACE*
          links.push({
            [currentLevel.toLowerCase() + 'Link']: {
              data: {id: part.key,
                route: this.standardDisplay ? [{view: 'Default', points: part.data.route}] : []
              }
            },
            versionId: this.versionId
          });*/
        }
      } else {  // Part is a node

        // Replace locations. Will need to be updated to replace individual location for the current view when views are implemented.
        /* *REPLACE*
        this.store.dispatch(new updateNodeActionMapping[currentLevel]({
          [currentLevel.toLowerCase()]: {
            data: {id: part.key, location: [{view: 'Default', locationCoordinates: part.data.location}]}
          },
          versionId: this.versionId
        }));*/
      }
    }.bind(this));

    if (links.length > 0) {
      // *REPLACE* this.store.dispatch( new updateLinkActionMapping[currentLevel](links) );
    }
  }

  // Update back end when a link is connected to a node
  //  -event
  //    -subject: link that has been connected
  updateLinkConnections(event: any): void {

    const draggingTool = event.diagram.toolManager.draggingTool;
    const relinkingTool = event.diagram.toolManager.relinkingTool;

    const link = event.subject;
    const currentLevel = this.filter.getValue().filterLevel;

    // Only implemented for system, data set and dimension views so far
    if (![Level.system, Level.dataSet, Level.dimension].includes(currentLevel)) {return ; }

    // Ignore disconnected links
    if (link.fromNode && link.toNode) {

      // Update link route
      link.updateRoute();

      // Create link if not already in database
      if (link.data.isTemporary) {

        // Create copy of link data with route in format required for back end
        const sendData = Object.assign({}, link.data);

        // Only save route if using standard display settings
        // *REPLACE* sendData.route = this.standardDisplay ? [{view: 'Default', points: link.data.route}] : [];

        // Add link to database
        /* *REPLACE*
        this.store.dispatch(new addLinkActionMapping[currentLevel]({
          [currentLevel.toLowerCase() + 'Link']: {
            data: sendData
          },
          versionId: this.versionId
        }));*/

        // Flag that link now exists in the database
        link.data.isTemporary = false;

        if (draggingTool.isActive) {draggingTool.doDeactivate(); }
      } else { // Link already exists in database, therefore do update

        // Prevent process from running twice when updating both ends of a link by dragging
        if (!draggingTool.isActive && !relinkingTool.isActive) {
          return ;
        }

        // Source/target properties
        const sourceProp = event.diagram.model.linkFromKeyProperty;
        const targetProp = event.diagram.model.linkToKeyProperty;

        // Update link source and target in the database
        /* *REPLACE*
        this.store.dispatch(new updateLinkActionMapping[currentLevel]({
          [currentLevel.toLowerCase() + 'Link']: {
            data: {id: link.key,
              [sourceProp]: link.fromNode.key,
              [targetProp]: link.toNode.key,
              route: this.standardDisplay ? [{view: 'Default', points: link.data.route}] : []
            }
          },
          versionId: this.versionId
        }));*/
      }

      /* When a link is newly connected between two nodes, other links between the same two nodes are
         rerouted. Therefore, these links must have their routes updated in the back end. */

      // Create set of links going between the same two nodes as the updated link
      const neighbourLinks = new go.Set();
      neighbourLinks.addAll(link.fromNode.findLinksBetween(link.toNode));
      // Do not include the reconnected link
      neighbourLinks.remove(link);

      // Gojs does not normally calculate the new routes until later.
      //  Therefore, make Gojs update the routes now so that accurate
      //  routes can be added to the back end.
      neighbourLinks.each(function(NLink: go.Link) {NLink.invalidateRoute(); NLink.updateRoute(); });

      // Update position of neighbouring links in back end
      this.updatePosition({subject: neighbourLinks});
    }
  }
}
