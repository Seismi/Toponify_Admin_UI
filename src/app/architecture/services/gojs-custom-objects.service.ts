import * as go from 'gojs';
import { LinkShiftingTool } from 'gojs/extensionsTS/LinkShiftingTool';
import { forwardRef, Inject, Injectable } from '@angular/core';
import { DiagramLevelService, Level } from './diagram-level.service';
import { Subject } from 'rxjs';
import {layers, middleOptions, NodeDetail} from '@app/architecture/store/models/node.model';
import { linkCategories } from '@app/architecture/store/models/node-link.model';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';
import { take } from 'rxjs/operators';

const $ = go.GraphObject.make;

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

// Custom resizing tool to resize system groups
export class CustomNodeResize extends go.ResizingTool {
  constructor() {
    super();
  }

  // Constrain minimum size to encompass all system group members
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
    //  ensure that no grouped system would be left outside the group member area
    group.memberParts.each(
      function(system: go.Part) {
        // Ignore links between nodes in the group
        if (system instanceof go.Node) {

          // Prevent the top side of the group being dragged too low
          if (draggedSides.top) {
            minSize.height = Math.max(minSize.height, memberArea.bottom - system.actualBounds.top);
          }
          // Prevent the right side of the group being dragged too far left
          if (draggedSides.right) {
            minSize.width = Math.max(minSize.width, system.actualBounds.right - memberArea.left);
          }
          // Prevent the bottom side of the group being dragged too high
          if (draggedSides.bottom) {
            minSize.height = Math.max(minSize.height, system.actualBounds.bottom - memberArea.top);
          }
          // Prevent the left side of the group being dragged too far right
          if (draggedSides.left) {
            minSize.width = Math.max(minSize.width, memberArea.right - system.actualBounds.left);
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

  // Override standard resize in order to prevent grouped systems from shifting position
  public resize(newr: go.Rect): void {
    const memberLocations = [];

    // Save grouped system's positions
    (this.adornedObject.part as go.Group).findSubGraphParts().each(
      function(member: go.Part) {
        if (member instanceof go.Node) {
          memberLocations.push({
            node: member,
            PrevPosition: member.position.copy()
          });
        }
      }
    );

    // Perform standard resizing
    go.ResizingTool.prototype.resize.call(this, newr);

    // Restore grouped system's positions from before the resizing
    memberLocations.forEach(function(nodeLocation) {
      nodeLocation.node.position = nodeLocation.PrevPosition;
    });

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
      toolManager.linkReshapingTool,
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
      !tools.some(function(tool) {
        return tool.isActive;
      }) &&
      !this.data.isTemporary
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
  // Observable to indicate that a new data set is to be added to a system
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
  // Observable to indicate that a new system should be added to the group as a new member
  private addNewSubItemSource = new Subject();
  public addNewSubItem$ = this.addNewSubItemSource.asObservable();

  public diagramEditable: boolean;

  constructor(
    private store: Store<RouterReducerState<RouterStateUrl>>,
    public diagramChangesService: DiagramChangesService,
    @Inject(
      forwardRef(function() {
        return DiagramLevelService;
      })
    )
    public diagramLevelService: DiagramLevelService
  ) {}

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
          thisService.store
            .select(getFilterLevelQueryParams)
            .pipe(take(1))
            .subscribe(level => {
              if (level === Level.usage) {
                event.diagram.layout.isValidLayout = false;
              }
            });
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
            // Can only expand link if layer is system or data set
            return layer === layers.system || layer === layers.dataSet;
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


  // Context menu for when a system group button is clicked
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
          ? new go.Binding('isEnabled', '', enabled_predicate)
          : {}
      );
    }

    // Button to appear when a menu button is moused over
    function makeSubMenuButton(
      row: number,
      name: string,
      action: (event: object, object?: go.GraphObject) => void,
      enabled_predicate?: (object: NodeDetail, event: object) => boolean,
      text_predicate?: (object: go.GraphObject, event: object) => string
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
            object.panel.elements.each(function(button: go.Part): void {
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
    const thisService = this;
    const diagramChangesService = this.diagramChangesService;
    const diagramLevelService = this.diagramLevelService;

    return $(go.Adornment, 'Spot',
      {
        name: 'ButtonMenu',
        background: null,
        zOrder: 1
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

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', !node.data.bottomExpanded);
            event.diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.none);

            diagramChangesService.nodeExpandChanged(node);
          },
          null,
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent): string {
            const node = (object.part as go.Adornment).adornedPart as go.Node;
            return node.data.bottomExpanded ? 'Hide Status' : 'Show Status';
          }
        ),
        makeButton(1, 'Show Details', function(event: go.DiagramEvent, object: go.Part): void {
          thisService.showDetailTabSource.next();
        }),
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
            return node.data.layer === 'system' ? true : false;
          }.bind(this)
        ),
        // --Grouped components submenu buttons--
        makeSubMenuButton(
          2,
          'Expand',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Group;
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', false);

            const newState = node.isSubGraphExpanded ? middleOptions.none : middleOptions.group;
            event.diagram.model.setDataProperty(node.data, 'middleExpanded', newState);

            diagramChangesService.nodeExpandChanged(node);

          }.bind(this),
          function(object: NodeDetail, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject) {

            const node = (object.part as go.Adornment).adornedObject as go.Group;
            return node.isSubGraphExpanded ? 'Collapse' : 'Expand';
          }
        ),
        makeSubMenuButton(
          3,
          'Show as List (groups)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', true);
            event.diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.groupList);

            diagramChangesService.nodeExpandChanged(node);

          }.bind(this),
          function(object: NodeDetail, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function() {return 'Show as List'; }
        ),
        makeSubMenuButton(
          4,
          'Display (groups)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            // diagramLevelService.changeLevelWithFilter.call(this, event, node);

          }.bind(this),
          null,
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          5,
          'Add Sub-item',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            this.addNewSubItemSource.next(node.data);

          }.bind(this),
          function(object: NodeDetail, event: go.DiagramEvent) {
            return thisService.diagramEditable;
          }
        ),
        makeSubMenuButton(
          6,
          'Add to Group',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            this.addSystemToGroupSource.next(node.data);
          }.bind(this),
          function(object: NodeDetail, event: go.DiagramEvent): boolean {
            return thisService.diagramEditable;
          },
          function(object: go.GraphObject): string {
            const node = (object.part as go.Adornment).adornedPart as go.Node;
            return node.data.group ? 'Move to Group' : 'Add to Group';
          }
        ),
        // --End of group submenu buttons--
        makeMenuButton(3, 'Data Sets', [
          'Show as List (data sets)',
          'Display (data sets)',
          'Add data set',
        ]),
        // --Data set submenu buttons--
        makeSubMenuButton(
          3,
          'Show as List (data sets)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            const newState = node.data.middleExpanded !== middleOptions.children ?
              middleOptions.children : middleOptions.none;

            event.diagram.model.setDataProperty(node.data, 'middleExpanded', newState);
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', true);

            diagramChangesService.nodeExpandChanged(node);
          },
          function(object: NodeDetail, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            return node.data.middleExpanded === middleOptions.children ? 'Hide List' : 'Show as List';
          }
        ),
        makeSubMenuButton(4,
          'Display (data sets)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;

            diagramLevelService.changeLevelWithFilter.call(this, event, node);
          }.bind(this),
          null,
          function() {return 'Display'; }
        ),
        makeSubMenuButton(
          5,
          'Add data set',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            thisService.addDataSetSource.next();
          },
          function(object: NodeDetail, event: go.DiagramEvent): boolean {
            return thisService.diagramEditable;
          }
        ),
        // --End of data set submenu buttons--
        makeMenuButton(
          4,
          'Analyse',
          [
            'Dependencies',
            'Use across Levels'
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
          function(object: NodeDetail, event: go.DiagramEvent): boolean {

            let isMapLevel: boolean;

            thisService
              .store
              .select(getFilterLevelQueryParams)
              .pipe(take(1))
              .subscribe(function(level) {
                isMapLevel =  (level !== Level.systemMap && level !== Level.dataSetMap);
              });

            return isMapLevel;

          }
        ),
        makeSubMenuButton(
          5,
          'Use across Levels',
          function(event: go.DiagramEvent, object: go.GraphObject): void {
            const node = (object.part as go.Adornment).adornedObject as go.Node;
            diagramLevelService.displayUsageView(event, node);
          }
        )
        // --End analysis submenu buttons--
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
}
