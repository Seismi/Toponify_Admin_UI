import * as go from 'gojs';
import {LinkShiftingTool} from '@app/architecture/official-gojs-extensions/LinkShiftingTool';
import {Injectable} from '@angular/core';
import {DiagramLevelService, Level} from './diagram-level.service';
import {Subject} from 'rxjs';
import {layers, bottomOptions, nodeCategories} from '@app/architecture/store/models/node.model';
import {colourOptions} from '@app/architecture/store/models/layout.model';
import {DiagramChangesService} from '@app/architecture/services/diagram-changes.service';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';
import {UndoLayoutChange} from '@app/architecture/store/actions/node.actions';

const $ = go.GraphObject.make;
const disabledTextColour = '#707070';

let currentService;

function textFont(style?: string): Object {
  const font = getComputedStyle(document.body).getPropertyValue('--default-font');
  return {
    font: `${style} ${font}`
  };
}

// Customised link that only updates its route when a tool that can affect link route is active
export class CustomLink extends go.Link {
  constructor() {
    super();
  }

  // Override computePoints method
  public computePoints(): boolean {

    // Failsafe - call ordinary computePoints process for any links that are partially disconnected and have no route
    if ((!this.fromNode || !this.toNode) && this.points.count === 0) {
      return go.Link.prototype.computePoints.call(this);
    }

    // Leave link route as is if link is disconnected - prevents bug where links dragged from palette were flipping
    if (!this.fromNode && !this.toNode) {
      return true;
    }

    if (this.data.isTemporary) {
      return go.Link.prototype.computePoints.call(this);
    }

    // Avoid errors that occur for links that do not have their diagram property set
    if (!this.diagram) {
      return go.Link.prototype.computePoints.call(this);
    }

    const toolManager = this.diagram.toolManager;
    const linkShiftingTool = toolManager.mouseDownTools.toArray().find(function (tool) {
      return tool.name === 'LinkShifting';
    });

    // Always update route if "updateRoute" flag set or no route defined
    if (this.data.updateRoute || this.points.count === 0) {
      // Reset "updateRoute" flag
      this.diagram.model.setDataProperty(this.data, 'updateRoute', false);
      return go.Link.prototype.computePoints.call(this);
    }

    // Update route for links connected to dragged nodes
    if (toolManager.draggingTool.isActive) {
      const draggedParts = new go.Set(toolManager.draggingTool.draggedParts.iteratorKeys);
      const linkAffected = draggedParts.any(function (part: go.Part): boolean {
        if (part instanceof go.Link) {
          return part === this;
        } else if (part instanceof go.Node) {
          return (new go.Set<go.Link>(part.findLinksConnected())).contains(this);
        }
      }.bind(this));

      if (linkAffected) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are being connected to a node
    } else if (toolManager.linkingTool.isActive) {
      if (toolManager.linkingTool.originalLink === this) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are having their endpoints shifted
    } else if (linkShiftingTool.isActive) {
      if ((linkShiftingTool['_handle'].part as go.Adornment).adornedObject.part === this) {
        return go.Link.prototype.computePoints.call(this);
      }
      // Update route for links that are connected to a node which is being resized
    } else if (toolManager.resizingTool.isActive) {
      const resizingNode = toolManager.resizingTool.adornedObject.part as go.Node;

      // Check if current link is connected to the node being resized
      //  (including links to nodes within the node if it is a collapsed group)
      if (this.fromNode === resizingNode || this.toNode === resizingNode
        || (!this.fromNode.isVisible() && this.fromNode.isMemberOf(resizingNode))
        || (!this.toNode.isVisible() && this.toNode.isMemberOf(resizingNode))
      ) {
        return go.Link.prototype.computePoints.call(this);
      }
    }

    // Otherwise, leave link route as is
    return true;
  }
}

function getShowStatusButton() {
  return makeButton(
    0,
    'Show Status',
    function(event: go.InputEvent, object: go.GraphObject): void {

      const anyStatusHidden = event.diagram.selection.any(
        function (part: go.Part): boolean {
          if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
            return !part.data.middleExpanded;
          } else {
            return !part.data.showLabel;
          }
        }
      );

      event.diagram.selection.each(function(part: go.Part): void {
        if (part instanceof go.Node && part.category !== nodeCategories.transformation) {
          event.diagram.model.setDataProperty(part.data, 'middleExpanded', anyStatusHidden);
          event.diagram.model.setDataProperty(part.data, 'bottomExpanded', bottomOptions.none);

          currentService.diagramChangesService.nodeExpandChanged(part);
        } else {
          event.diagram.model.setDataProperty(part.data, 'showLabel', anyStatusHidden);
          if (part.category === nodeCategories.transformation) {
            currentService.diagramChangesService.transformationNodeShowLabelChanged(part);
          } else {
            currentService.diagramChangesService.linkShowLabelChanged(part);
          }
          currentService.diagramChangesService.onUpdateDiagramLayout.next({});
        }
      });
    },
    null,
    function(object: go.GraphObject, event: go.InputEvent): boolean {
      return event.diagram.allowMove;
    },
    function(object: go.GraphObject, event: go.InputEvent): string {

      const anyStatusHidden = event.diagram.selection.any(
        function (part: go.Part): boolean {
          if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
            return !part.data.middleExpanded;
          } else {
            return !part.data.showLabel;
          }
        }
      );
      return anyStatusHidden ? 'Show Status' : 'Hide Status';
    }
  );
}

function getColourChangeMenu(isGroup = true) {

  // Offset for button position in non-group nodes, to account for group options button not being visible
  const buttonOffset = isGroup ? 0 : 1;

  return [
    makeMenuButton(
      2,
      'Change Colour',
      [
        'Blue',
        'Red',
        'Green',
        'Purple',
        'Orange',
        'None'
      ],
      null,
      null,
      function(object: go.GraphObject, event: go.InputEvent): boolean {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      2,
      'Blue',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.blue);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      3 + buttonOffset,
      'Red',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.red);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      4 + buttonOffset,
      'Green',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.green);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      5 + buttonOffset,
      'Purple',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.purple);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      6 + buttonOffset,
      'Orange',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.orange);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    ),
    makeSubMenuButton(
      7 + buttonOffset,
      'None',
      function(event: go.InputEvent, object: go.GraphObject): void  {
        changeColours(event.diagram, colourOptions.none);
      },
      function(object: go.GraphObject, event: go.InputEvent) {
        return event.diagram.allowMove;
      }
    )
  ];

  function changeColours(diagram: go.Diagram, colour: colourOptions): void {
    diagram.selection.each(function(part): void {
      diagram.model.setDataProperty(part.data, 'colour', colour);
      if (part instanceof go.Node) {
        currentService.diagramChangesService.nodeColourChanged(part);
      } else {
        currentService.diagramChangesService.linkColourChanged(part);
      }
    });
    currentService.diagramChangesService.onUpdateDiagramLayout.next({});
  }
}

export function defineRoundButton() {
  return go.GraphObject.defineBuilder('RoundButton', function(args) {
    const button = $('Button');
    (button.findObject('ButtonBorder') as go.Shape).figure = 'Circle';
    return button;
  });
}

@Injectable()
export class GojsCustomObjectsService {
  // Observable to indicate that the detail tab should be displayed
  private showRightPanelTabSource = new Subject();
  public showRightPanelTab$ = this.showRightPanelTabSource.asObservable();
  // Observable to indicate that a new scope should be created for the selected node
  private createScopeWithNodeSource = new Subject();
  public createScopeWithNode$ = this.createScopeWithNodeSource.asObservable();
  // Observable to indicate that a new data node is to be added to a system
  private addDataSetSource = new Subject();
  public addDataSet$ = this.addDataSetSource.asObservable();
  // Observable to indicate that the grid display should be toggled
  private showHideGridSource = new Subject();
  public showHideGrid$ = this.showHideGridSource.asObservable();
  // Observable to indicate that the diagram should be zoomed in or out
  private zoomSource = new Subject();
  public zoom$ = this.zoomSource.asObservable();
  // Observable to indicate that the radio alert should be toggled
  private showHideRadioAlertSource = new Subject();
  public showHideRadioAlert$ = this.showHideRadioAlertSource.asObservable();
  // Observable to indicate that the system should be assigned to a new group
  private addSystemToGroupSource = new Subject();
  public addSystemToGroup$ = this.addSystemToGroupSource.asObservable();
  // Observable to indicate that the system was dropped in a group
  private setSystemGroupSource = new Subject();
  public setSystemGroup$ = this.setSystemGroupSource.asObservable();
  // Observable to indicate that a new node should be added to the group as a new member
  private addNewSubItemSource = new Subject();
  public addNewSubItem$ = this.addNewSubItemSource.asObservable();
  // Observable to indicate that a shared copy of an existing node should be added to the group as a new member
  private addNewSharedSubItemSource = new Subject();
  public addNewSharedSubItem$ = this.addNewSharedSubItemSource.asObservable();
  // Observable to indicate that a shared copy of an existing node should be made into the master
  private setAsMasterSource = new Subject();
  public setAsMaster$ = this.setAsMasterSource.asObservable();
  // Observable to flag that the last action performed was moving parts using the arrow keys
  private arrowKeyMoveSource = new Subject();
  public arrowKeyMove$ = this.arrowKeyMoveSource.asObservable();

  public diagramEditable: boolean;
  private currentLevel;

  constructor(
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public diagramChangesService: DiagramChangesService,
    // @Inject(
    //   forwardRef(function() {
    //     return DiagramLevelService;
    //   })
    // )
    public diagramLevelService: DiagramLevelService
  ) {
    this.store.select(getFilterLevelQueryParams).subscribe(level => (this.currentLevel = level));
    currentService = this;
  }

  // Context menu for when the background is right-clicked
  getBackgroundContextMenu(): go.Adornment {
    const thisService = this;

    return $(
      'ContextMenu',
      // Toggle the background grid on or off
      $('ContextMenuButton', $(go.TextBlock, 'Enable/Disable Grid', {}), {
        click: function(event, object) {
          thisService.showHideGridSource.next();
        }
      }),
      // Zoom in a bit
      $('ContextMenuButton', $(go.TextBlock, 'Zoom in', {}), {
        click: function(event, object) {
          thisService.zoomSource.next('In');
        }
      }),
      // Zoom out a bit
      $('ContextMenuButton', $(go.TextBlock, 'Zoom out', {}), {
        click: function(event, object) {
          thisService.zoomSource.next('Out');
        }
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Reorganise'), {
        click: function(event, object) {
          thisService.diagramChangesService.reorganise(event.diagram);
        }
      }),
      $('ContextMenuButton', $(go.TextBlock, 'Reorganise Links'), {
        click: function(event, object) {
          thisService.diagramChangesService.reorganiseLinks(event.diagram);
        }
      })
    );
  }

  // Context menu for when a link is right-clicked
  getLinkContextMenu(): go.Adornment {
    const thisService = this;

    return $(go.Adornment, 'Spot',
      {
        name: 'LinkMenu',
        background: null,
        zOrder: 1,
        isInDocumentBounds: true
      },
      $(go.Panel, 'Table',
        {
          alignment: new go.Spot(1, 0, -20, 0),
          alignmentFocus: go.Spot.TopLeft
        },
        getShowStatusButton(),
        // View detail for the link in the right hand panel
        makeButton(1,
          'View Detail',
          function() {
            thisService.showRightPanelTabSource.next();
          }
        ),
        ...getColourChangeMenu(),
        makeButton(3,
          'Expand',
          function(event, object) {
            const part = (object.part as go.Adornment).adornedObject;
            part.doubleClick(event, part);
          },
          function(object) {
            const part = (object.part as go.Adornment).adornedObject as go.Link;
            const layer = part.data.layer;
            // Cannot expand from the reporting layer
            return layer !== layers.reportingConcept;
          }
        )
      )
    );
  }


  // Context menu for nodes
  getPartButtonMenu(fixedPosition = true, isGroup = true): go.Adornment {

    const thisService = this;
    const diagramChangesService = this.diagramChangesService;
    const diagramLevelService = this.diagramLevelService;

    return $(go.Adornment, 'Spot',
      {
        name: 'ButtonMenu',
        background: null,
        zOrder: 1,
        isInDocumentBounds: true
      },
      // Use placeholder to ensure menu placed relative to node.
      //  Otherwise, menu appears at the mouse cursor.
      fixedPosition ?
        $(go.Placeholder,
          {
            background: null,
            isActionable: true,
          }) :
        {},
      $(go.Panel,
        'Table',
        {
          alignment: new go.Spot(1, 0, -20, 0),
          alignmentFocus: go.Spot.TopLeft
        },
        getShowStatusButton(),
        makeButton(1,
          'Show Details',
          function(event: go.InputEvent, object: go.Part): void {
            thisService.showRightPanelTabSource.next();
          },
          null,
          function(object: go.Part, event: go.InputEvent): boolean {
            return event.diagram.selection.count === 1;
          }
        ),
        ...getColourChangeMenu(isGroup),
        makeMenuButton(
          3,
          'Grouped Components',
            [
              'Expand',
              'Show as List (groups)',
              'Display (groups)',
              'Add Sub-item',
              'Add to Group'
            ],
          function(object: go.GraphObject): boolean {
            const node = (object.part as go.Adornment).adornedPart as go.Node;
            return [layers.system, layers.data].includes(node.data.layer);
          }.bind(this)
        ),
        // --Grouped components submenu buttons--
        makeSubMenuButton(
          3,
          'Expand',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const anyCollapsed = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return !part.isSubGraphExpanded;
              }
              return false;
            });

            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', true);

                const newState = anyCollapsed ? bottomOptions.group : bottomOptions.none;
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);

                diagramChangesService.nodeExpandChanged(part);
              }
            });

          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.InputEvent) {

            const anyCollapsed = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return !part.isSubGraphExpanded;
              }
              return false;
            });
            return anyCollapsed ? 'Expand' : 'Collapse';
          }
        ),
        makeSubMenuButton(
          4,
          'Show as List (groups)',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return part.data.bottomExpanded !== bottomOptions.groupList;
              }
              return false;
            });

            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                const newState = anyHidden ? bottomOptions.groupList : bottomOptions.none;
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', true);
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);

                diagramChangesService.nodeExpandChanged(part);
              }
            });

          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.InputEvent) {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return part.data.bottomExpanded !== bottomOptions.groupList;
              }
              return false;
            });
            return anyHidden ? 'Show as List' : 'Hide List';
          }
        ),
        makeSubMenuButton(
          5,
          'Display (groups)',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayGroupMembers.call(this, event, node);

          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent) {
            return event.diagram.selection.count === 1;
          },
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          6,
          'Add Sub-item',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            if (node.data.layer === layers.data) {
              thisService.addNewSharedSubItemSource.next(node.data);
            } else {
              thisService.addNewSubItemSource.next(node.data);
            }

          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent) {

            if (event.diagram.selection.count !== 1) {
              return false;
            }

            const node = (object.part as go.Adornment).adornedObject as go.Node;

            return thisService.diagramEditable &&
              thisService.currentLevel !== Level.usage &&
              !node.data.isShared;
          }
        ),
        makeSubMenuButton(
          7,
          'Add to Group',
          function(event: go.InputEvent, object: go.GraphObject): void {
            const selectedNodes = new go.Set<go.Group>();

            // Ignore links and transformation nodes when adding to new group
            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                selectedNodes.add(part);
              }
            });
            this.addSystemToGroupSource.next(selectedNodes);
          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            const node = (object.part as go.Adornment).adornedObject as go.Node;

            return thisService.diagramEditable &&
              thisService.currentLevel !== Level.usage &&
              node.data.layer !== layers.data;
          },
          function(object: go.GraphObject): string {
            const node = (object.part as go.Adornment).adornedPart as go.Node;

            if (thisService.currentLevel === Level.system
              && node.diagram.selection.count > 1) {
              return 'Add/Move to Group';
            }

            return node.data.group ? 'Move to Group' : 'Add to Group';
          }
        ),
        // --End of group submenu buttons--
        makeMenuButton(
          4,
          'Data Nodes',
            [
              'Show as List (data nodes)',
              'Display (data nodes)',
              'Add data node',
            ],
          function(object: go.GraphObject) {
            const node = (object.part as go.Adornment).adornedPart as go.Node;
            return node.data.layer !== 'reporting concept';
          }.bind(this),
          function(object: go.GraphObject) {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            switch (node.data.layer) {
              case layers.data:
                return 'Dimensions';
              case layers.dimension:
                return 'Reporting Layer';
              default:
                return 'Data Nodes';
            }
          }
        ),
        // --Data node submenu buttons--
        makeSubMenuButton(
          4,
          'Show as List (data nodes)',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return part.data.bottomExpanded !== bottomOptions.children;
              }
              return false;
            });

            const newState = anyHidden ? bottomOptions.children : bottomOptions.none;

            event.diagram.selection.each(function(part: go.Part): void {

              if (part instanceof go.Node && part.data.category !== nodeCategories.transformation) {
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', newState);
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', true);

                diagramChangesService.nodeExpandChanged(part);
              }
            });
          },
          function(object: go.GraphObject, event: go.InputEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.InputEvent) {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
                return part.data.bottomExpanded !== bottomOptions.children;
            });
            return anyHidden ? 'Show as List' : 'Hide List';
          }
        ),
        makeSubMenuButton(
          5,
          'Display (data nodes)',
          function(event: go.InputEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;

            diagramLevelService.changeLevelWithFilter.call(this, event, node);
          }.bind(this),
          function(object: go.GraphObject, event: go.InputEvent) {
            return event.diagram.selection.count === 1;
          },
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          6,
          'Add data node',
          function(event: go.InputEvent, object: go.GraphObject): void {
            thisService.addDataSetSource.next();
          },
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            if (event.diagram.selection.count !== 1) {
              return false;
            }
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return thisService.diagramEditable &&
              ![nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category);
          },
          function(object: go.GraphObject): string {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            switch (node.data.layer) {
              case layers.data:
                return 'Add dimension';
              case layers.dimension:
                return 'Add reporting concept';
              default:
                return 'Add data node';
            }
          }
        ),
        // --End of data node submenu buttons--
        makeMenuButton(
          5,
          'Analyse',
          [
            'Dependencies',
            'Use across Levels',
            'View Sources',
            'View Targets'
          ],
          null,
          null,
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            return event.diagram.selection.count === 1;
          }
        ),
        // --Analysis submenu buttons--
        makeSubMenuButton(
          5,
          'Dependencies',
          function(event: go.InputEvent, object: go.GraphObject): void {
            const menuNode = (object.part as go.Adornment).adornedObject as go.Node;

            const anyHidden: boolean = event.diagram.nodes.any(function(node: go.Node): boolean {
              return !node.visible;
            });

            if (anyHidden) {
              diagramChangesService.showAllNodes(event.diagram);
            } else {
              diagramChangesService.hideNonDependencies(menuNode);
            }
          },
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            const level = thisService.currentLevel;
            return !level.endsWith('map');
          }
        ),
        makeSubMenuButton(
          6,
          'Use across Levels',
          function(event: go.InputEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayUsageView(event, node);
          },
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            const level = thisService.currentLevel;
            return !level.endsWith('map');
          }
        ),
        makeSubMenuButton(
          7,
          'View Sources',
          function(event: go.InputEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displaySourcesView(event, node);
          },
          null,
          null,
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category)
              && node.data.isShared;
          }
        ),
        makeSubMenuButton(
          8,
          'View Targets',
          function(event: go.InputEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayTargetsView(event, node);
          },
          null,
          null,
          function(object: go.GraphObject, event: go.InputEvent): boolean {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category);
          }
        ),
        // --End analysis submenu buttons--
        makeButton(
          6,
          'Set as Master',
          function(event: object, object: go.GraphObject) {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            thisService.setAsMasterSource.next(node.data);
          },
          function(object: go.GraphObject, event: object) {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return node.data.layer === layers.data;
          },
          function(object: go.GraphObject, event: object) {
            const node = (object.part as go.Adornment).adornedObject as go.Group;

            return node.data.category !== nodeCategories.dataStructure &&
              node.data.isShared &&
              !node.containingGroup.data.isShared;
          }
        )
      )
    );
  }

  // returns the gojs object containing a guide with instructions for users
  getInstructions(): go.Part {

    return $(go.Part,
      'Horizontal',
      {
        name: 'Guide',
        selectable: false,
        layerName: 'Grid',
        padding: 10
      },
      $(go.TextBlock,
        textFont('italic 30px'),
        {
          name: 'instructions',
          stroke: '#D6D6D6',
          textAlign: 'center'
        }
      )
    );
  }

}
