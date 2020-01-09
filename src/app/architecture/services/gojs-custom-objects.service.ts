import * as go from 'gojs';
import { LinkShiftingTool } from 'gojs/extensionsTS/LinkShiftingTool';
import { forwardRef, Inject, Injectable } from '@angular/core';
import { DiagramLevelService, Level } from './diagram-level.service';
import { Subject } from 'rxjs';
import { layers } from '@app/architecture/store/models/node.model';
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
    const tools = [toolManager.draggingTool, toolManager.linkReshapingTool, toolManager.linkingTool, linkShiftingTool];

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

    // Call standard computePoints method
    return go.Link.prototype.computePoints.call(this);
  }
}

export function defineRoundButton() {
  return go.GraphObject.defineBuilder('RoundButton', function (args) {
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
  // Observable to indicate that the grid display should be toggled
  private showHideGridSource = new Subject();
  public showHideGrid$ = this.showHideGridSource.asObservable();
  // Observable to indicate that the diagram should be zoomed in or out
  private zoomSource = new Subject();
  public zoom$ = this.zoomSource.asObservable();
  // Observable to indicate that the radio alert should be toggled
  private showHideRadioAlertSource = new Subject();
  public showHideRadioAlert$ = this.showHideRadioAlertSource.asObservable();

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
      })
    );
  }

  // Context menu for when a node or link is right-clicked
  getPartContextMenu(): go.Adornment {
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
        new go.Binding('visible', '', function(object, event) {
          if (event.diagram.findNodeForData(object) !== null) {
            // Can only expand nodes if not reporting concept
            return object.layer !== layers.reportingConcept;
          } else {
            // Can only expand link if category is data and layer is data set
            return object.category === linkCategories.data && object.layer === layers.dataSet;
          }
        })
      ),
      // View detail for the node/link in the right hand panel
      $('ContextMenuButton', $(go.TextBlock, 'View Detail', {}), {
        click: function(event, object) {
          thisService.showDetailTabSource.next();
        }
      }),
      // Create a scope that includes the node
      $(
        'ContextMenuButton',
        $(go.TextBlock, 'Create Scope', {}),
        {
          click: function(event, object) {
            thisService.createScopeWithNodeSource.next(object);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the create scope option for nodes
          return event.diagram.findNodeForData(object) !== null;
        })
      ),
      // Analyse dependencies of a node
      $(
        'ContextMenuButton',
        $(go.TextBlock, 'Analyse Dependencies', {}),
        {
          click: function(event, object) {
            const part = (object.part as go.Adornment).adornedObject;
            diagramChangesService.hideNonDependencies(part as go.Node);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the analyse dependencies option for nodes..
          return (
            event.diagram.findNodeForData(object) !== null &&
            // ..that are not in map view
            !object.group
          );
        })
      ),
      // Return to architecture view from dependency analysis view
      $(
        'ContextMenuButton',
        $(go.TextBlock, 'Return to Architecture View', {}),
        {
          click: function(event, object) {
            diagramChangesService.showAllNodes(event.diagram);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the return to architecture option for nodes..
          return (
            event.diagram.findNodeForData(object) !== null &&
            // ..and if some nodes in the diagram are hidden
            event.diagram.nodes.any(function(node) {
              return !node.visible;
            })
          );
        })
      ),
      // Go to node usage view, for the current node
      $(
        'ContextMenuButton',
        $(go.TextBlock, 'Show Use Across Levels', {}),
        {
          click: function(event, object) {
            diagramLevelService.displayUsageView(event, (object.part as go.Adornment).adornedObject);
          }
        },
        new go.Binding('visible', '', function(object, event) {
          // Only show the node usage view option for nodes
          return event.diagram.findNodeForData(object) !== null;
        })
      )
    );
  }

  // Context menu for when a system group button is clicked
  getPartButtonMenu(): go.Adornment {

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
      action: (event: object, object?: go.Part) => void,
      visible_predicate?: (object: go.Part, event: object) => boolean,
      enabled_predicate?: (object: go.Part, event: object) => boolean,
    ): go.Part {
      return $(
        'ContextMenuButton',
        $(go.TextBlock, text),
        {
          click: action,
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
      action: (event: object, object?: go.Part) => void,
      enabled_predicate?: (object: go.Part, event: object) => boolean,
      text?: string
    ): go.Part {
      return $('ContextMenuButton', $(go.TextBlock, text || name), {
        click: action,
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
    const diagramChangesService = this.diagramChangesService;
    const diagramLevelService = this.diagramLevelService;

    return $(go.Adornment, 'Spot',
      {
        name: 'ButtonMenu',
        background: null
      },
      $(go.Placeholder,
        {
          background: null,
          isActionable: true,
        }),
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
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', true);

            diagramChangesService.nodeExpandChanged(node);
          },
          null,
          function(object: go.GraphObject, event: go.DiagramEvent): boolean {
            return event.diagram.allowMove;
          }
        ),
        makeButton(1, 'Show Details', function(event: object): void {
          /*Placeholder*/
        }),
        makeMenuButton(2, 'Grouped Components', [
          'Expand',
          'Show as List (groups)',
          'Display (groups)',
          'Add Sub-item',
          'Add to Group'
        ]),
        // --Grouped components submenu buttons--
        makeSubMenuButton(
          2,
          'Expand',
          function(event: any, object: any): void {
          }.bind(this)
        ),
        makeSubMenuButton(
          3,
          'Show as List (groups)',
          function(event: any, object: any): void {
          }.bind(this),
          null,
          'Show as List'
        ),
        makeSubMenuButton(
          4,
          'Display (groups)',
          function(event: any, object: any): void {
          }.bind(this),
          null,
          'Display'
        ),
        makeSubMenuButton(
          5,
          'Add Sub-item',
          function(event: any, object: any): void {
          }.bind(this)
        ),
        makeSubMenuButton(
          6,
          'Add to Group',
          function(event: any, object: any): void {
          }.bind(this)
        ),
        // --End of level submenu buttons--
        makeMenuButton(3, 'Data Sets', [
          'Show as List (data sets)',
          'Display (data sets)',
          'Add data set',
        ]),
        makeSubMenuButton(
          3,
          'Show as List (data sets)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;
            event.diagram.model.setDataProperty(node.data, 'middleExpanded', true);
            event.diagram.model.setDataProperty(node.data, 'bottomExpanded', true);

            diagramChangesService.nodeExpandChanged(node);
          },
          function(object: go.GraphObject, event: go.DiagramEvent) {
            return event.diagram.allowMove;
          },
          'Show as List'
        ),
        makeSubMenuButton(4,
          'Display (data sets)',
          function(event: go.DiagramEvent, object: go.GraphObject): void {

            const node = (object.part as go.Adornment).adornedObject as go.Node;

            diagramLevelService.changeLevelWithFilter.call(this, event, node);
          }.bind(this),
          null,
          'Display'
        ),
        makeSubMenuButton(
          5,
          'Add data set',
          function(event: object): void {
            /*Placeholder*/
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
}
