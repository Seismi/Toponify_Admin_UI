import {Injectable} from '@angular/core';
import * as go from 'gojs';
import {DiagramViewChangesService} from '@app/architecture/services/diagram-view-changes.service';

let thisService: ContextMenuService;

const $ = go.GraphObject.make;
const disabledTextColour = '#707070';

export interface SimpleButtonArguments {
  text: string;
  action?: (target: go.Part | go.Diagram) => void;
  visiblePredicate?: (target: go.Part | go.Diagram) => boolean;
  enabledPredicate?: (target: go.Part | go.Diagram) => boolean;
  textPredicate?: (target: go.Part | go.Diagram) => string;
}

interface ButtonArguments extends SimpleButtonArguments {
  row: number;
}

interface MenuButtonArguments extends ButtonArguments {
  subMenuNames: string[];
}

interface SubMenuButtonArguments extends ButtonArguments {
  fromMenuRow: number;
}

interface ContextMenuParams extends SimpleButtonArguments {
  subButtonArguments?: (SimpleButtonArguments)[];
}

/*
This service handles the creation of customised context menus for use in the diagram.
 It provides an interface through which a context menu can be built just by providing
 needed parameters to determine how the menu buttons should act.
*/

@Injectable()
export class ContextMenuService {

  constructor(
    private diagramViewChangesService: DiagramViewChangesService
  ) {
    thisService = this;
  }

  // Returns context menu with a vertical list of buttons
  createSimpleContextMenu(buttonArguments: SimpleButtonArguments[]): go.Adornment {

    const menuButtons = buttonArguments.map(
      function(buttonArg: SimpleButtonArguments): go.Panel {
        return $(
          'ContextMenuButton',
          {
            name: buttonArg.text,
            click: function(event: go.InputEvent, object: go.GraphObject): void {
              buttonArg.action(event.diagram);
            }
          },
          $(go.TextBlock,
            buttonArg.text,
            new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
              return enabled ? 'black' : disabledTextColour;
            }).ofObject(buttonArg.text)
          ),
          buttonArg.enabledPredicate
            ? new go.Binding('isEnabled', '', buttonArg.enabledPredicate).ofObject()
            : {}
        );
      }
    );

    return $(
      'ContextMenu',
      ...menuButtons
    );
  }

  // Returns a context menu with the option of having submenus that branch from the main menu
  createTwoLevelContextMenu(name: string, buttonArguments: ContextMenuParams[], fixedPosition = false): go.Adornment {

    // Create buttons for the main list of the context menu
    const menuButtons = buttonArguments.map(
      function(buttonArg: ContextMenuParams, index: number): go.Panel {
        if (buttonArg.subButtonArguments && buttonArg.subButtonArguments.length > 0) {

          const subMenuButtonNames = buttonArg.subButtonArguments.map(
            function(subButtonArg: SimpleButtonArguments): string {return subButtonArg.text; }
          );

          return thisService.makeMenuButton(<MenuButtonArguments>
            {
              row: index,
              subMenuNames: subMenuButtonNames,
              ...buttonArg
            }
          );
        } else {
          return thisService.makeButton(<ButtonArguments>
            {
              row: index,
              ...buttonArg
            }
          );
        }
      }
    );

    const subMenuButtons = [];

    // Create buttons for submenus opened from a button on the primary menu of the context menu
    buttonArguments.forEach(
      function(buttonArg: ContextMenuParams, index: number) {
        if (buttonArg.subButtonArguments && buttonArg.subButtonArguments.length > 0) {
          const subButtons = buttonArg.subButtonArguments.map(
            function(subButtonArg: SimpleButtonArguments, subIndex: number) {
              return thisService.makeSubMenuButton(
                {
                  row: index + subIndex,
                  fromMenuRow: index,
                  ...subButtonArg
                }
              );
            }
          );
          subMenuButtons.push(...subButtons);
        }
      }
    );

    return  $(
      go.Adornment, 'Spot',
      {
        name: name,
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
      $(go.Panel, 'Table',
        {
          name: 'context menu table',
          alignment: new go.Spot(1, 0, -20, 0),
          alignmentFocus: go.Spot.TopLeft
        },
        ...menuButtons,
        ...subMenuButtons
      )
    );
  }

  // Return a regular button for a context menu
  makeButton(args: ButtonArguments): go.Panel {
    return $(
      'ContextMenuButton',
      {
        name: args.text,
        click: function(event: go.InputEvent, object: go.GraphObject): void {
          const part = (object.part as go.Adornment).adornedObject as go.Part;
          args.action(part);
          part.removeAdornment('ButtonMenu');
        },
        column: 0,
        row: args.row,
        mouseEnter: function(event: object, object: go.Panel) {
          thisService.standardMouseEnter(event, object);
          // Hide any open submenu when user mouses over button
          object.panel.elements.each(function(button: go.Panel): void {
            if (button.column === 1) {
              button.visible = false;
            }
          });
        }
      },
      $(go.TextBlock,
        args.textPredicate
          ? new go.Binding('text', '', args.textPredicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(args.text)
      ),
      // Don't bother with binding GraphObject.visible if there's no predicate
      args.visiblePredicate
        ? new go.Binding('visible', '', function(
        object: go.Panel,
        event: go.InputEvent
        ): boolean {
          if (object.diagram) {
            const part = (object.part as go.Adornment).adornedObject as go.Part;
            return args.visiblePredicate(part);
          } else {
            return false;
          }
        }).ofObject()
        : {},
      args.enabledPredicate
        ? new go.Binding('isEnabled', '', args.enabledPredicate).ofObject()
        : {}
    );
  }

  // Return a button to open a submenu from the context menu
  makeMenuButton(
    args: MenuButtonArguments
  ): go.Panel {
    return $('ContextMenuButton',
      {
        name: args.text,
        mouseEnter: function(event: go.InputEvent, object: go.Panel): void {

          const menu = object.part as go.Adornment;

          thisService.standardMouseEnter(event, object);
          // Hide any open submenu that is already open
          object.panel.elements.each(function(button: go.Panel): void {
            if (button.column === 1) {
              button.visible = false;
            }
          });

          if (!object.isEnabled) {return; }

          // Show any submenu buttons assigned to this menu button
          args.subMenuNames.forEach(function(buttonName: string): void {
            menu.findObject(buttonName).visible = true;
          });

          // Ensure that opened submenus do not appear outside of diagram bounds
          thisService.diagramViewChangesService.updateViewAreaForMenu(menu);

        },
        column: 0,
        row: args.row
      },
      $(go.TextBlock,
        args.textPredicate
          ? new go.Binding('text', '', args.textPredicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(args.text)
      ),
      // Don't bother with binding GraphObject.visible if there's no predicate
      args.visiblePredicate
        ? new go.Binding('visible', '', function(
        object: go.Panel,
        event: go.InputEvent
        ): boolean {
          if (object.diagram) {
            const part = (object.part as go.Adornment).adornedObject as go.Part;
            return args.visiblePredicate(part);
          } else {
            return false;
          }
        }).ofObject()
        : {},
      args.enabledPredicate
        ? new go.Binding('isEnabled', '', args.enabledPredicate).ofObject()
        : {}
    );
  }

  // Button to appear when a menu button is moused over
  makeSubMenuButton(
    args: SubMenuButtonArguments
  ): go.Panel {
    return $('ContextMenuButton',
      {
        click: function(event: go.InputEvent, object: go.Panel): void {
          const part = (object.part as go.Adornment).adornedObject as go.Part;
          args.action(part);
          part.removeAdornment('ButtonMenu');
        },
        mouseEnter: thisService.standardMouseEnter,
        name: args.text,
        visible: false,
        column: 1,
        row: args.row
      },
      // This row binding calculates an offset necessary to ensure that no submenu button
      //  lies on the same table row as a hidden button from the main menu. Otherwise,
      //  there can exist rows with gaps in the main menu instead of buttons.
      new go.Binding('row', '', function(table: go.Panel): number {

        let row = args.row;

        table.elements.each(function(element: go.GraphObject): void {
          if (element.column === 0 &&
            element.row <= row &&
            element.row >= args.fromMenuRow &&
            !element.visible
          ) {
            row++;
          }
        });
        return row;
      }).ofObject('context menu table'),
      $(go.TextBlock,
        args.textPredicate
          ? new go.Binding('text', '', args.textPredicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled: boolean): string {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(args.text)
      ),
      args.enabledPredicate
        ? new go.Binding('isEnabled', '', args.enabledPredicate).ofObject()
        : {},
      // Visible predicate sets button height to zero when evaluated to false.
      // Cannot use the "visible" property here as that is already used by the menu button
      //  to show/hide the submenu buttons.
      args.visiblePredicate
        ? new go.Binding('height', '', function(object: go.GraphObject, event: go.InputEvent): number {
          const part = (object.part as go.Adornment).adornedObject as go.Part;
          return args.visiblePredicate(part) ? 20 : 0;
        }).ofObject()
        : {}
    );
  }

  standardMouseEnter(e: object, btn: go.Panel): void {
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
}
