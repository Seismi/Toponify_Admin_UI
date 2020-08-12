import * as go from 'gojs';
import {LinkShiftingTool} from 'gojs/extensionsTS/LinkShiftingTool';
import {forwardRef, Inject, Injectable} from '@angular/core';
import {DiagramLevelService, Level} from './diagram-level.service';
import {Subject} from 'rxjs';
import {layers, middleOptions, nodeCategories, NodeDetail} from '@app/architecture/store/models/node.model';
import {DiagramChangesService} from '@app/architecture/services/diagram-changes.service';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {getFilterLevelQueryParams} from '@app/core/store/selectors/route.selectors';

const $ = go.GraphObject.make;

function textFont(style?: string): Object {
  const font = getComputedStyle(document.body).getPropertyValue('--default-font');
  return {
    font: `${style} ${font}`
  };
}

export const customIcons = {
  tree: go.Geometry.parse('M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z', true),
  flag: go.Geometry.parse('M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z', true),
  list: go.Geometry.parse(
    'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
    true
  )
};

// Customised link shifting tool that calls process to update the link route in the back end when finished
export class CustomLinkShift extends LinkShiftingTool {
  constructor() {
    super();
  }

  // Override mouseUp method
  public doMouseUp(): void {
    const shiftedLink = (this['_handle'].part as go.Adornment).adornedObject.part;
    this.diagram.raiseDiagramEvent('LinkReshaped', shiftedLink);

    LinkShiftingTool.prototype.doMouseUp.call(this);
  }
}

// Custom resizing tool to resize system/data groups
export class CustomNodeResize extends go.ResizingTool {
  constructor() {
    super();
  }

  doActivate() {
    go.ResizingTool.prototype.doActivate.call(this);

    (this.adornedObject.part as go.Group).findSubGraphParts().each(
      function(node) {
        node.data.tempSavedPosition = node.position.copy();
      }
    );
  }

  // Constrain minimum size to encompass all system/data group members
  public computeMinSize(): go.Size {

    // Default minimum size irrespective of group members
    const minSize = go.ResizingTool.prototype.computeMinSize.call(this);
    const group = this.adornedObject.part as go.Group;

    // Determine which way/ways the group is being enlarged
    //  based on alignment of the resizing handle being dragged
    const draggedSides = {
      top: this.handle.alignment.y === 0,
      right: this.handle.alignment.x === 1,
      bottom: this.handle.alignment.y === 1,
      left: this.handle.alignment.x === 0
    };

    // Get bounds of current group member area
    const memberArea = this.adornedObject.getDocumentBounds();

    // For each direction the group is being enlarged in,
    //  ensure that no grouped node would be left outside the group member area
    group.memberParts.each(
      function(node: go.Part) {
        // Ignore links between nodes in the group
        if (node instanceof go.Node) {

          // Prevent the top side of the group being dragged too low
          if (draggedSides.top) {
            minSize.height = Math.max(minSize.height, memberArea.bottom - node.actualBounds.top);
          }
          // Prevent the right side of the group being dragged too far left
          if (draggedSides.right) {
            minSize.width = Math.max(minSize.width, node.actualBounds.right - memberArea.left);
          }
          // Prevent the bottom side of the group being dragged too high
          if (draggedSides.bottom) {
            minSize.height = Math.max(minSize.height, node.actualBounds.bottom - memberArea.top);
          }
          // Prevent the left side of the group being dragged too far right
          if (draggedSides.left) {
            minSize.width = Math.max(minSize.width, memberArea.right - node.actualBounds.left);
          }
        }
      }
    );

    return minSize;
  }

  public computeMaxSize(): go.Size {

    // Default maximum size irrespective of group membership
    const maxSize = go.ResizingTool.prototype.computeMaxSize.call(this);
    const group = this.adornedObject.part as go.Group;

    // If group is itself contained in a group then ensure that the group is not
    //  expanded outside the bounds of its containing group
    if (group.containingGroup) {
      const containingArea = group.containingGroup.resizeObject.getDocumentBounds();
      const groupContainingArea = group.resizeObject.getDocumentBounds();
      const groupArea = group.getDocumentBounds();

      // Constrain group member area size, accounting for the resulting size of the whole group
      maxSize.height = Math.max(maxSize.height,  containingArea.height + groupContainingArea.height - groupArea.height);
      maxSize.width = Math.max(maxSize.width,  containingArea.width + groupContainingArea.width - groupArea.width);
    }

    return maxSize;
  }

  // Override standard resize in order to prevent grouped nodes from shifting position
  public resize(newr: go.Rect): void {
    const memberLocations = [];

    // Perform standard resizing
    go.ResizingTool.prototype.resize.call(this, newr);

    // Restore grouped node's positions from before the resizing
    (this.adornedObject.part as go.Group).findSubGraphParts().each(
      function(node) {
        node.position = node.data.tempSavedPosition;
    });

  }

  doDeactivate() {

    // Remove temporary saved position from node data
    (this.adornedObject.part as go.Group).findSubGraphParts().each(
      function(node) {
        delete node.data.tempSavedPosition;
      }
    );

    return go.ResizingTool.prototype.doDeactivate.call(this);
  }
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

    const toolManager = this.diagram.toolManager;
    const linkShiftingTool = toolManager.mouseDownTools.toArray().find(function(tool) {
      return tool.name === 'LinkShifting';
    });

    // Array of tools that can affect link routes
    const tools = [toolManager.draggingTool,
      toolManager.linkingTool,
      linkShiftingTool,
      toolManager.resizingTool
    ];

    // Always update route if "updateRoute" flag set or no route defined
    if (this.data.updateRoute || this.points.count === 0) {
      // Reset "updateRoute" flag
      this.diagram.model.setDataProperty(this.data, 'updateRoute', false);
      return go.Link.prototype.computePoints.call(this);
    }

    // Leave link route as it is if no tools active and link is not temporary
    if (
      !this.data.isTemporary &&
      !tools.some(function(tool) {
        return tool.isActive;
      })
    ) {
      return true;
    }

    // Leave link route as is if resizing a node that the link is not connected to
    if (toolManager.resizingTool.isActive) {

      const resizingNode = toolManager.resizingTool.adornedObject.part as go.Node;

      // Check if current link is connected to the node being resized
      if (this.fromNode.data.id !== resizingNode.data.id &&
        this.toNode.data.id !== resizingNode.data.id) {
        return true;
      }
    }

    // Call standard computePoints method
    return go.Link.prototype.computePoints.call(this);
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
  private showDetailTabSource = new Subject();
  public showDetailTab$ = this.showDetailTabSource.asObservable();
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
  // Observable to indicate that a new node should be added to the group as a new member
  private addNewSubItemSource = new Subject();
  public addNewSubItem$ = this.addNewSubItemSource.asObservable();
  // Observable to indicate that a shared copy of an existing node should be added to the group as a new member
  private addNewSharedSubItemSource = new Subject();
  public addNewSharedSubItem$ = this.addNewSharedSubItemSource.asObservable();
  // Observable to indicate that a shared copy of an existing node should be made into the master
  private setAsMasterSource = new Subject();
  public setAsMaster$ = this.setAsMasterSource.asObservable();

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
      // Toggle RADIO alert on nodes
      $('ContextMenuButton', $(go.TextBlock, 'show / hide RADIO alert', {}), {
        click: function(event, object) {
          thisService.showHideRadioAlertSource.next();
          const modelData = event.diagram.model.modelData;
          event.diagram.model.setDataProperty(modelData, 'showRadioAlerts', !modelData.showRadioAlerts);

          // Redo layout for node usage view after updating RADIO alert display setting
          if (thisService.currentLevel === Level.usage) {
            event.diagram.layout.isValidLayout = false;
          }
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
    const diagramChangesService = this.diagramChangesService;
    const diagramLevelService = this.diagramLevelService;

    return $(
      'ContextMenu',
      $(
        'ContextMenuButton',
        $(go.TextBlock, 'Expand'),
        {
          click: function(event, object) {
            const part = (object.part as go.Adornment).adornedObject;
            part.doubleClick(event, part);
          }
        },
        new go.Binding('visible', 'layer', function(layer) {
            // Can only expand link if layer is system or data
            return layer === layers.system || layer === layers.data;
        })
      ),
      // View detail for the link in the right hand panel
      $('ContextMenuButton', $(go.TextBlock, 'View Detail', {}), {
        click: function(event, object) {
          thisService.showDetailTabSource.next();
        }
      })
    );
  }


  // Context menu for when a group button is clicked
  getPartButtonMenu(fixedPosition = true): go.Adornment {

    const disabledTextColour = '#707070';

    // Standard highlighting for buttons when mouse cursor enters them
    function standardMouseEnter(e: object, btn: go.Part): void {
      if (!btn.isEnabledObject()) {
        return;
      }
      const shape: go.GraphObject = btn.findObject('ButtonBorder'); // the border Shape
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
      action: (event: object, object?: go.GraphObject) => void,
      visible_predicate?: (object: go.GraphObject, event: object) => boolean,
      enabled_predicate?: (object: go.GraphObject, event: object) => boolean,
      text_predicate?: (object: go.GraphObject, event: object) => string
    ): go.Part {
      return $(
        'ContextMenuButton',
        {
          name: text
        },
        $(go.TextBlock,
          text_predicate
            ? new go.Binding('text', '', text_predicate).ofObject()
            : { text: text },
          new go.Binding('stroke', 'isEnabled', function(enabled) {
            return enabled ? 'black' : disabledTextColour;
          }).ofObject(text)
        ),
        {
          click: function(event, object) {
            action(event, object);
            ((object.part as go.Adornment).adornedObject as go.Node)
              .removeAdornment('ButtonMenu');
          },
          column: 0,
          row: row,
          mouseEnter: function(event: object, object: go.Part) {
            standardMouseEnter(event, object);
            // Hide any open submenu when user mouses over button
            object.panel.elements.each(function(button: go.Part) {
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
          : {},
        enabled_predicate
          ? new go.Binding('isEnabled', '', enabled_predicate).ofObject()
          : {}
      );
    }

    // Button to appear when a menu button is moused over
    function makeSubMenuButton(
      row: number,
      name: string,
      action: (event: object, object?: go.GraphObject) => void,
      enabled_predicate?: (object: go.GraphObject, event: object) => boolean,
      text_predicate?: (object: go.GraphObject, event: object) => string,
      visibleCondition?: (object: go.GraphObject, event: object) => boolean
    ): go.Part {
      return $('ContextMenuButton',
        {
          name: name
        },
        $(go.TextBlock,
          text_predicate
            ? new go.Binding('text', '', text_predicate).ofObject()
            : { text: name },
          new go.Binding('stroke', 'isEnabled', function(enabled) {
            return enabled ? 'black' : disabledTextColour;
          }).ofObject(name)
        ),
        {
        click: function(event, object) {
          action(event, object);
          ((object.part as go.Adornment).adornedObject as go.Node)
            .removeAdornment('ButtonMenu');
        },
        name: name,
        visible: false,
        column: 1,
        row: row
      },
        enabled_predicate
          ? new go.Binding('isEnabled', '', enabled_predicate).ofObject()
          : {},
        visibleCondition
          ? new go.Binding('height', '', function(object: go.GraphObject, event: object) {
            return visibleCondition(object, event) ? 20 : 0;
          }).ofObject()
          : {}
      );
    }

    // Button to show a submenu when moused over
    function makeMenuButton(
      row: number,
      text: string,
      subMenuNames: string[],
      visible_predicate?: (object: go.Part, event: object) => boolean,
      text_predicate?: (object: go.GraphObject, event: object) => string
    ): go.Part {
      return $('ContextMenuButton',
        {
          name: text
        },
        $(go.TextBlock,
          text_predicate
            ? new go.Binding('text', '', text_predicate).ofObject()
            : { text: text }
        ),
        {
          mouseEnter: function(event: go.InputEvent, object: go.Part): void {

            const menu = object.part as go.Adornment;

            standardMouseEnter(event, object);
            // Hide any open submenu that is already open
            object.panel.elements.each(function(button: go.Part): void {
              if (button.column === 1) {
                button.visible = false;
              }
            });

            // Show any submenu buttons assigned to this menu button
            subMenuNames.forEach(function(buttonName: string): void {
              menu.findObject(buttonName).visible = true;
            });

            // Ensure that opened submenus do not appear outside of diagram bounds
            diagramChangesService.updateViewAreaForMenu(menu);

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
        makeButton(
          0,
          'Show Status',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const anyStatusHidden = event.diagram.selection.any(
              function (part: go.Part): boolean {
                if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
                  return part.data.bottomExpanded;
                }
                return false;
              }
            );

            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Node && part.category !== nodeCategories.transformation) {
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', anyStatusHidden);
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', middleOptions.none);

                diagramChangesService.nodeExpandChanged(part);
              }
            });
          },
          null,
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent): string {

            const anyStatusHidden = event.diagram.selection.any(
              function (part: go.Part): boolean {
                if ((part instanceof go.Node) && part.category !== nodeCategories.transformation) {
                  return part.data.bottomExpanded;
                }
                return false;
              }
            );
            return anyStatusHidden ? 'Show Status' : 'Hide Status';
          }
        ),
        makeButton(1,
          'Show Details',
          function(event: go.DiagramEvent, object: go.Part): void {
            thisService.showDetailTabSource.next();
          },
          null,
          function(object: go.Part, event: go.DiagramEvent): boolean {
            return event.diagram.selection.count === 1;
          }
        ),
        makeMenuButton(
          2,
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
          2,
          'Expand',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const anyCollapsed = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return !part.isSubGraphExpanded;
              }
              return false;
            });

            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', false);

                const newState = anyCollapsed ? middleOptions.group : middleOptions.none;
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', newState);

                diagramChangesService.nodeExpandChanged(part);
              }
            });

          }.bind(this),
          function(object: go.GraphObject, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {

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
          3,
          'Show as List (groups)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return !part.isSubGraphExpanded;
              }
              return false;
            });

            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                const newState = anyHidden ? middleOptions.groupList : middleOptions.none;
                event.diagram.model.setDataProperty(part.data, 'bottomExpanded', true);
                event.diagram.model.setDataProperty(part.data, 'middleExpanded', newState);

                diagramChangesService.nodeExpandChanged(part);
              }
            });

          }.bind(this),
          function(object: go.GraphObject, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {

            const anyHidden = event.diagram.selection.any(function(part: go.Part): boolean {
              if (part instanceof go.Group) {
                return !part.isSubGraphExpanded;
              }
              return false;
            });
            return anyHidden ? 'Show as List' : 'Hide List';
          }
        ),
        makeSubMenuButton(
          4,
          'Display (groups)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayGroupMembers.call(this, event, node);

          }.bind(this),
          function(object: go.GraphObject, event: go.DiagramEvent) {
            return event.diagram.selection.count === 1;
          },
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          5,
          'Add Sub-item',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            if (node.data.layer === layers.data) {
              thisService.addNewSharedSubItemSource.next(node.data);
            } else {
              thisService.addNewSubItemSource.next(node.data);
            }

          }.bind(this),
          function(object: go.GraphObject, event: go.DiagramEvent) {

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
          6,
          'Add to Group',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            const selectedNodes = new go.Set<go.Group>();

            // Ignore links and transformation nodes when adding to new group
            event.diagram.selection.each(function(part: go.Part): void {
              if (part instanceof go.Group) {
                selectedNodes.add(part);
              }
            });
            this.addSystemToGroupSource.next(selectedNodes);
          }.bind(this),
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
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
          3,
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
          3,
          'Show as List (data nodes)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            const newState = node.data.middleExpanded !== middleOptions.children ?
              middleOptions.children : middleOptions.none;

            event.diagram.model.setDataProperty(node.data, 'middleExpanded', newState);
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', true);

            diagramChangesService.nodeExpandChanged(node);
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return node.data.middleExpanded === middleOptions.children ? 'Hide List' : 'Show as List';
          }
        ),
        makeSubMenuButton(4,
          'Display (data nodes)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;

            diagramLevelService.changeLevelWithFilter.call(this, event, node);
          }.bind(this),
          null,
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          5,
          'Add data node',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            thisService.addDataSetSource.next();
          },
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
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
          4,
          'Analyse',
          [
            'Dependencies',
            'Use across Levels',
            'View Sources',
            'View Targets'
          ]
        ),
        // --Analysis submenu buttons--
        makeSubMenuButton(
          4,
          'Dependencies',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
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
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            const level = thisService.currentLevel;
            return !level.endsWith('map');
          }
        ),
        makeSubMenuButton(
          5,
          'Use across Levels',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayUsageView(event, node);
          },
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            const level = thisService.currentLevel;
            return !level.endsWith('map');
          }
        ),
        makeSubMenuButton(
          6,
          'View Sources',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displaySourcesView(event, node);
          },
          null,
          null,
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category)
              && node.data.isShared;
          }
        ),
        makeSubMenuButton(
          7,
          'View Targets',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayTargetsView(event, node);
          },
          null,
          null,
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return [nodeCategories.dataSet, nodeCategories.masterDataSet].includes(node.data.category);
          }
        ),
        // --End analysis submenu buttons--
        makeButton(5,
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

  // Create a linear gradient brush through the provided colours
  // Inputs:
  //    colours - array of colours to go through
  //    fromSpot - spot where brush should start
  //    toSpot - spot brush should end
  createCustomBrush(colours: string[], fromSpot = go.Spot.Top, toSpot = go.Spot.Bottom): go.Brush {
    // Replace any nulls in colours array with default black
    colours = colours.map(function(colour) {
      return colour || 'black';
    });

    // Parameters for brush
    const newBrushParams: any = {};

    // -- Triple up colours in array in order to ensure less gradual --
    // -- transition between colours --
    const temp: string[] = [];

    colours.forEach(function(colour) {
      temp.push(colour);
      temp.push(colour);
      temp.push(colour);
    });

    colours = temp;

    // -- End of tripling up process --

    // Distribute points for colours evenly across the brush
    colours.forEach(function(colour, index) {
      newBrushParams[String(index / (colours.length - 1))] = colour;
    });

    // Set start and end spots for the brush
    newBrushParams.start = fromSpot;
    newBrushParams.end = toSpot;

    return $(go.Brush, 'Linear', newBrushParams);
  }

  // Set node dragComputation to this to prevent dragging one node to overlap another
  avoidNodeOverlap(node: go.Node, newLoc: go.Point, snappedLoc: go.Point): go.Point | null {

    // Do not run when resizing nodes
    if (node.diagram.currentTool instanceof go.ResizingTool) {
      return newLoc;
    }

    // Allow overlap for grouped nodes in map view so user can drag nodes to rearrange the order.
    // Group layout will ensure there is ultimately no overlap.
    if (this.currentLevel.endsWith('map') && node.data.category !== nodeCategories.transformation) {
      return newLoc;
    }

    if (node.diagram instanceof go.Palette) { return snappedLoc; }
    // this assumes each node is fully rectangular
    const bnds = node.actualBounds;
    const loc = node.location;
    // use newLoc instead of snappedLoc if you want to ignore any grid snapping behavior
    // see if the area at the proposed location is unoccupied
    const rectangle = new go.Rect(snappedLoc.x - (loc.x - bnds.x), snappedLoc.y - (loc.y - bnds.y), bnds.width, bnds.height);

    rectangle.inflate(-0.5, -0.5);  // by default, deflate to avoid edge overlaps with "exact" fits
    // when dragging a node from another Diagram, choose an unoccupied area
    if (!(node.diagram.currentTool instanceof go.DraggingTool) &&
      (!node['_temp'] || !node.layer.isTemporary)) {  // in Temporary Layer during external drag-and-drop
      node['_temp'] = true;  // flag to avoid repeated searches during external drag-and-drop
      while (!this.diagramChangesService.isUnoccupied(rectangle, node)) {
        rectangle.x += 10;
        rectangle.y += 2;
      }
      rectangle.inflate(0.5, 0.5);  // restore to actual size
      // return the proposed new location point
      return new go.Point(rectangle.x + (loc.x - bnds.x), rectangle.y + (loc.y - bnds.y));
    }
    if (this.diagramChangesService.isUnoccupied(rectangle, node)) { return snappedLoc; }  // OK
    return loc;  // give up -- don't allow the node to be moved to the new location
  }

  // returns the gojs object containing a guide with instructions for users
  getInstructions(): go.Part {

    const thisService = this;

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
