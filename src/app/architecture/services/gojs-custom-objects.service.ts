import * as go from 'gojs';
import {forwardRef, Inject, Injectable, OnDestroy} from '@angular/core';
import {DiagramLevelService, Level, lessDetailOrderMapping, moreDetailOrderMapping} from './diagram-level.service';
import { FilterService } from './filter.service';

const $ = go.GraphObject.make;

// Customised link that only updates its route when a tool that can affect link route is active
export class CustomLink extends go.Link {
  constructor() {
    super();
  }

  // Override computePoints method
  public computePoints(): boolean {

    // Leave link route as is if link is disconnected - prevents bug where links dragged from palette were flipping
    if (!this.fromNode && !this.toNode) {return true; }

    const toolManager = this.diagram.toolManager;
    const linkShiftingTool = toolManager.mouseDownTools.toArray().find(
      function(tool) {return tool.name === 'LinkShifting'; }
    );

    // Array of tools that can affect link routes
    const tools = [toolManager.draggingTool,
      toolManager.linkReshapingTool,
      toolManager.linkingTool,
      linkShiftingTool];

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


@Injectable()
export class GojsCustomObjectsService {

  constructor(
    public filterService: FilterService,
    @Inject(forwardRef(function() {return DiagramLevelService; })) public diagramLevelService: DiagramLevelService
  ) {
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

          const filter = this.diagramLevelService.filter;

          const filterLevel = moreDetailOrderMapping[filter.getValue().filterLevel];
          if (filterLevel) {
            this.filterService.setFilter({filterLevel: filterLevel});
          }
        }.bind(this),
        function(object: go.Part, event: object): boolean {
          return (object as any).nodeDataArray.length > 0 &&
            this.diagramLevelService.filter.getValue().filterLevel !== Level.reportingConcept
            && !this.mapView;
        }.bind(this)
      ),
      makeSubMenuButton(
        5,
        'Less detail',
        function(event: any, object: any): void {

          const filter = this.diagramLevelService.filter;
          const history = this.diagramLevelService.historyOfFilters;

          const filterLevel = lessDetailOrderMapping[filter.getValue().filterLevel];
          if (filterLevel) {
            let newFilter = { filterLevel: filterLevel };
            if (history[filterLevel]) {
              newFilter = {
                filterLevel: filterLevel,
                ...(history[filterLevel].filterNodeIds && {filterNodeIds: this.historyOfFilters[filterLevel].filterNodeIds})
              };
            }
            this.filterService.setFilter(newFilter);
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
}
