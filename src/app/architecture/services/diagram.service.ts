import {Location} from '@angular/common';
import {Injectable, OnDestroy} from '@angular/core';
import {SetViewLevel} from '@app/architecture/store/actions/view.actions';
import {Store} from '@ngrx/store';
import * as go from 'gojs';
import 'gojs/extensions/Figures.js';
import {BehaviorSubject, Subscription} from 'rxjs';
import * as uuid from 'uuid/v4';
// import { SetMapView } from '@app/version/store/actions/mapview.actions';
import {layers, Node, nodeCategories} from '@app/nodes/store/models/node.model';
import {linkCategories} from '@app/nodes/store/models/node-link.model';
import {FilterService} from '@app/architecture/services/filter.service';
import {ArchitectureState} from '@app/architecture/store/reducers';

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
      (level === Level.dataSet) ? this.getModelNodeTemplate() : this.getSystemNodeTemplate()
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
        new Node({ id: 'New Rollup Reporting Concept',
          name: 'New Rollup Reporting Concept',
          layer: layers.reportingConcept,
          category: nodeCategories.rollup
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
      this.getModelNodeTemplate() :
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

    // Only implemented for system, model and dimension views so far
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

    // Only implemented for system, model and dimension views so far
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

    // Only implemented for system, model and dimension views so far
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

  // Get item template for list of node children
  getItemTemplate() {
    return $(go.Panel,
      'Auto',
      {
        background: 'black',
        stretch: go.GraphObject.Horizontal
      },
      $(go.Panel,
      'Horizontal',
      {
        background: 'white',
        margin: new go.Margin(1)
      },
        $(go.TextBlock,
          {
            stroke: 'black',
            font: '14px calibri'
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        )
      )
    );
  }

  getSystemNodeTemplate() {

    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      $(
        go.Shape,
        new go.Binding('figure', 'category', function(category) {
          if (category === nodeCategories.transactional) {
            return 'Cylinder1';
          } else if (category === nodeCategories.analytical) {
            return 'Cube2';
          } else if (category === nodeCategories.file) {
            return 'Document';
          } else if (category === nodeCategories.masterData) {
            return 'ManualInput';
          } else {
            // Reporting
            return 'RoundedRectangle';
          }
        }),
        // Bind height for transactional system to make consistent
        //  with previously used GoJs 1.8 shape
        new go.Binding('minSize', 'category', function(category) {
          if (category === 'transactional') {
            return new go.Size(NaN, 157.14285714285714);
          } else {
            return new go.Size(NaN, NaN);
          }
        }),
        {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          fromLinkableSelfNode: false,
          toLinkableSelfNode: false,
          fromLinkableDuplicates: true,
          toLinkableDuplicates: true,
          name: 'shape'
        }
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // System name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
         ),
        // System description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
         ),
        // System tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function(tags) {return tags ? ('Tags - ' + tags) : ''; }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // System owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function(owner) {return owner ? ('Owner - ' + owner) : ''; }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Model list header
          $(go.TextBlock,
            {
              text: 'Models',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide models header if system has no models
            new go.Binding('visible', 'descendants',
              function(descendants) {return descendants.length > 0; }
            )
          ),
          // Model list
          $(go.Panel, 'Vertical',
            {
              name: 'Model_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getModelNodeTemplate() {

    // Template for Model
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape, 'Rectangle', {
        fill: 'white',
        stroke: 'black',
        strokeWidth: 1,
        portId: '',
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        name: 'shape',
        fromLinkableDuplicates: true,
        toLinkableDuplicates: true
      }),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        $(go.TextBlock,
          {
            alignment: go.Spot.TopRight,
            background: null,
            font: 'bold 20px calibri'
          },
          new go.Binding('text',
            'category',
            function (category) {
              if (category === nodeCategories.virtual) {
                return 'V';
              } else if (category === nodeCategories.masterData) {
                return 'MD';
              } else {
                // Physical data set
                return '';
              }
            }
          )
        ),
        // Model name
        $(
          go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
        ),
        // Model description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
         ),
        // Model tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text', 'tags', function(tags) {
            return tags ? 'Tags - ' + tags : '';
          }),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Model owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function(owner) {return owner ? ('Owner - ' + owner) : ''; }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Dimension list header
          $(go.TextBlock,
            {
              text: 'Dimensions',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide dimensions header if model has no dimensions
            new go.Binding('visible', 'descendants',
              function(descendants) {return descendants.length > 0; }
            )
          ),
          // Dimension list
          $(go.Panel, 'Vertical',
            {
              name: 'Dimension_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getDimensionNodeTemplate() {

    // Template for dimension
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        selectionAdorned: true,
        resizable: false,
        // tslint:disable-next-line:no-bitwise
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        isShadowed: false,
        portSpreading: go.Node.SpreadingEvenly,
        locationSpot: go.Spot.Top,
        doubleClick: this.changeLevelWithFilter.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      // Have the diagram position the node if no location set
      // this.mapView ? {} : new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape,
        'RoundedRectangle',
        {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          // fromSpot: go.Spot.AllSides,
          // toSpot: go.Spot.AllSides,
          name: 'shape',
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false
        },
        new go.Binding('fromSpot', 'group', function(group) {
          if (this.mapView) {
            if (this.mapView.sourceModel.id === group) {
              return go.Spot.RightSide;
            } else {
              return go.Spot.LeftSide;
            }
          } else {
            return go.Spot.AllSides;
          }
        }.bind(this)),
        new go.Binding('toSpot', 'group', function(group) {
          if (this.mapView) {
            if (this.mapView.sourceModel.id === group) {
              return go.Spot.RightSide;
            } else {
              return go.Spot.LeftSide;
            }
          } else {
            return go.Spot.AllSides;
          }
        }.bind(this))
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // Dimension name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
         ),
        // Dimension description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
         ),
        // Dimension tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function(tags) {return tags ? ('Tags - ' + tags) : ''; }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Dimension owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function(owner) {return owner ? ('Owner - ' + owner) : ''; }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Element list header
          $(go.TextBlock,
            {
              text: 'Elements',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide elements header if dimension has no elements
            new go.Binding('visible', 'descendants',
              function(descendants) {return descendants.length > 0; }
            )
          ),
          // Element list
          $(go.Panel, 'Vertical',
            {
              name: 'Element_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'descendants')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  getElementNodeTemplate() {

    // Template for master data elements
    return $(
      go.Node,
      'Auto',
      new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          selectionAdorned: true,
          resizable: false,
          // tslint:disable-next-line:no-bitwise
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
          isShadowed: false,
          portSpreading: go.Node.SpreadingEvenly,
          locationSpot: go.Spot.Top,
          // TEMP
          isLayoutPositioned: true
        },
      // Have the diagram position the node if no location set
      new go.Binding('isLayoutPositioned', 'locationMissing'),
      // Make the shape the port for links to connect to
      $(go.Shape,
        new go.Binding('figure', 'subCategory', function(subcategory) {
          if (subcategory === 'mdlist') {
            return 'Process';
          } else if (subcategory === 'mdstructure') {
            return 'InternalStorage';
          } else {
            return 'Document';
          }
        }),
        {
          fill: 'white',
          stroke: 'black',
          strokeWidth: 1,
          portId: '',
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          name: 'shape',
          fromLinkableDuplicates: false,
          toLinkableDuplicates: false
        }
      ),
      $(go.Panel,
        'Vertical',
        {
          alignment: go.Spot.TopCenter,
          minSize: new go.Size(100, 100),
          margin: 5
        },
        // Element name
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'bold 16px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'name'),
          new go.Binding('visible', 'name').ofModel()
         ),
        // Element description
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: 'italic 15px calibri',
            maxSize: new go.Size(100, Infinity),
            margin: new go.Margin(0, 0, 5, 0)
          },
          new go.Binding('text', 'description'),
          new go.Binding('visible', 'description').ofModel()
         ),
        // Element tags
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'tags',
            function(tags) {return tags ? ('Tags - ' + tags) : ''; }
          ),
          new go.Binding('visible', 'tags').ofModel()
        ),
        // Element owners
        $(go.TextBlock,
          {
            textAlign: 'center',
            stroke: 'black',
            font: '15px calibri',
            maxSize: new go.Size(100, Infinity)
          },
          new go.Binding('text',
            'owner',
            function(owner) {return owner ? ('Owner - ' + owner) : ''; }
          ),
          new go.Binding('visible', 'owner').ofModel()
        ),
        $(go.Panel, 'Vertical',
          {
            stretch: go.GraphObject.Horizontal
          },
          // Attribute list header
          $(go.TextBlock,
            {
              text: 'Attributes',
              row: 1,
              alignment: go.Spot.Center,
              stroke: 'black',
              font: 'bold 15.25px calibri',
              margin: new go.Margin(5, 0, 0, 0)
            },
            // Hide attributes header if element has no attributes
            new go.Binding('visible', 'attributes',
              function(attributes) {return attributes.length > 0; }
            )
          ),
          // Attribute list
          $(go.Panel, 'Vertical',
            {
              name: 'Attribute_List',
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.getItemTemplate()
            },
            new go.Binding('itemArray', 'attributes')
          ),
          new go.Binding('visible', 'nextLevel').ofModel()
        )
      )
    );
  }

  CustomLink() {
    go.Link.call(this);
  }

  getLinkDataTemplate(forPalette: boolean = false) {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function(points) {
        const PointArray = points.toArray();
        const Path = [];

        for (let i = 0; i < PointArray.length; i++) {
          Path.push(PointArray[i].x);
          Path.push(PointArray[i].y);
        }

        return Path;
      }),
      new go.Binding('visible', 'dataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing',
        function(routeMissing) {
          return routeMissing || !this.standardDisplay;
        }.bind(this)
      ),
      {
        selectionAdorned: true,
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        relinkableFrom: true,
        relinkableTo: true,
        fromEndSegmentLength: 10,
        toEndSegmentLength: 10,
        doubleClick: this.displayMapView.bind(this),
        // TEMP
        isLayoutPositioned: true
      },
      forPalette ? {
        // Set locationSpot in order for palette to arrange link correctly
        locationSpot: go.Spot.TopCenter,
        // Correct locationSpot on selection highlight adornment when link in palette
        selectionAdornmentTemplate: $(go.Adornment, 'Link', {
            locationSpot: new go.Spot(0.5, 0, 1, 0)
          },
          $(go.Shape, {
            isPanelMain: true, fill: null, stroke: 'dodgerblue', strokeWidth: 3
          })
        )
      } : {},
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'Black',
        strokeWidth: 2.5,
        strokeDashArray: [5, 5]
      },
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? {areaBackground: 'transparent'} : {}
      ),
      !forPalette ?
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 14px calibri'
            },
            new go.Binding('areaBackground', 'name',
              function(name) {return (name ? 'white' : null ); }
            ),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          $(go.TextBlock,
            {
              font: '13px calibri'
            },
            new go.Binding('areaBackground', 'label',
              function(label) {return (label ? 'white' : null ); }
            ),
            new go.Binding('text', 'label'),
            new go.Binding('visible', 'linkLabel').ofModel()
          )
        ) : {},
      $(
        go.Shape, // The 'to' arrowhead
        {
          scale: 1.2,
          stroke: 'Black',
          toArrow: 'Triangle'
        }
      )
    );
  }

  getLinkMasterDataTemplate(forPalette: boolean = false) {
    return $(
      CustomLink,
      new go.Binding('points', 'route').makeTwoWay(function(points) {

        const PointArray = points.toArray();
        const Path = [];

        for (let i = 0; i < PointArray.length; i++) {
          Path.push(PointArray[i].x);
          Path.push(PointArray[i].y);
        }

        return Path;
      }),
      new go.Binding('visible', 'masterDataLinks').ofModel(),
      // Have the diagram position the link if no route set or if not using standard display options
      new go.Binding('isLayoutPositioned', 'routeMissing',
        function(routeMissing) {
          return routeMissing || !this.standardDisplay;
        }.bind(this)
      ),
      {
        selectionAdorned: true,
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        relinkableFrom: true,
        relinkableTo: true,
        // contextMenu: PartContextMenu,
        fromEndSegmentLength: 20,
        toEndSegmentLength: 20,
        // Position by layout in palette
        isLayoutPositioned: true // forPalette
      },
      forPalette ? {
        // Set locationSpot in order for palette to arrange link correctly
        locationSpot: go.Spot.TopCenter,
        // Correct locationSpot on selection highlight adornment when link in palette
        selectionAdornmentTemplate: $(go.Adornment, 'Link', {
            locationSpot: go.Spot.TopCenter
          },
          $(go.Shape, {
            isPanelMain: true, fill: null, stroke: 'dodgerblue', strokeWidth: 3
          })
        )
      } : {},
      $(go.Shape, {
        isPanelMain: true,
        stroke: 'black',
        strokeWidth: 2.5
      },
        // If link is in palette then give it a transparent background for easier selection
        forPalette ? {areaBackground: 'transparent'} : {}
      ),
      !forPalette ?
        $(go.Panel, 'Vertical',
          $(go.TextBlock,
            {
              font: 'bold 14px calibri'
            },
            new go.Binding('areaBackground', 'name',
              function(name) {return (name ? 'white' : null ); }
            ),
            new go.Binding('text', 'name'),
            new go.Binding('visible', 'linkName').ofModel()
          ),
          $(go.TextBlock,
            {
              font: '13px calibri'
            },
            new go.Binding('areaBackground', 'label',
              function(label) {return (label ? 'white' : null ); }
            ),
            new go.Binding('text', 'label'),
            new go.Binding('visible', 'linkLabel').ofModel()
          )
        ) : {},
    );
  }

  getModelGroupTemplate() {
    // Template for model groups in mapping view
    return $(
      go.Group,
      'Vertical', {
        layout: $(go.GridLayout, {
          wrappingColumn: 1,
          spacing: new go.Size(NaN, 20),
          alignment: go.GridLayout.Location,
          isOngoing: true,
          isInitial: true,
          // Function to compare nodes for ordering during layout
          comparer: function(a, b) {
            // Only perform this comparison for initial layout. This prevents users' reordering of nodes from being overridden.
            if (this.groupLayoutInitial) {
              // Get nodes connected to each node
              const aLinkedNodes = a.findNodesConnected();
              const bLinkedNodes = b.findNodesConnected();

              // Place unconnected nodes after nodes with links
              if (aLinkedNodes.count === 0 && bLinkedNodes.count !== 0) {
                return 1;
              } else if (aLinkedNodes.count !== 0 && bLinkedNodes.count === 0) {
                return -1;
              } else if (aLinkedNodes.count !== 0 && bLinkedNodes.count !== 0) {

                // Initialise variables to hold total heights of connected nodes for each compare node
                let aHeights = 0;
                let bHeights = 0;

                 // Total y values of co-ordinates of centre of each node connected to node a
                while (aLinkedNodes.next()) {
                  aHeights = aHeights + aLinkedNodes.value.findObject('shape').getDocumentPoint(go.Spot.Center).y;
                }

                // Calculate average height by dividing by the number of linked nodes
                aHeights = aHeights / aLinkedNodes.count;

                 // Total y values of co-ordinates of centre of each node connected to node b
                while (bLinkedNodes.next()) {
                  bHeights = bHeights + bLinkedNodes.value.findObject('shape').getDocumentPoint(go.Spot.Center).y;
                }

                // Calculate average height by dividing by the number of linked nodes
                bHeights = bHeights / bLinkedNodes.count;

                 // Compare average connected node height to determine order
                if (aHeights > bHeights) {return 1; } else if (bHeights > aHeights) {return -1; }
              }
            }

            // Can reorder elements
            const ay = a.location.y;
            const by = b.location.y;
            if (isNaN(ay) || isNaN(by)) {return 0; }
            if (ay < by) {return -1; }
            if (ay > by) {return 1; }
            return 0;
          }.bind(this)
        }),
        computesBoundsAfterDrag: true,
        computesBoundsIncludingLocation: true,
        locationSpot: go.Spot.TopCenter,
        locationObjectName: 'shape',
        isLayoutPositioned: true,
        layoutConditions: go.Part.LayoutStandard,
        selectable: false,
        avoidable: false,
        minSize: new go.Size(250, 0)
      },
      new go.Binding('location', 'location', go.Point.parse),
      $(go.Panel, 'Auto',
        {stretch: go.GraphObject.Fill},
        $(go.Shape,
          {
            fill: '#ebe9ea',
            stroke: 'transparent',
            strokeWidth: 2,
            name: 'shape'
          }
        ),
        $(go.Panel,
          'Vertical',
          {margin: 10},
          $(go.TextBlock,
            {
              font: 'bold 20px calibri',
              textAlign: 'center',
              stroke: 'black',
              alignment: go.Spot.TopCenter,
              stretch: go.GraphObject.Horizontal,
              width: 180
            },
            new go.Binding('text', 'name')
          ),
          $(go.Placeholder, {alignment: go.Spot.TopCenter})
         )
       )
    );
  }
}
