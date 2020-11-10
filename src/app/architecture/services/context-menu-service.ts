import {Injectable} from '@angular/core';
import * as go from 'gojs';

let thisService;

const $ = go.GraphObject.make;
const disabledTextColour = '#707070';

interface SimpleButtonArguments {
  text: string;
  action: (event: go.InputEvent, object?: go.GraphObject) => void;
  visiblePredicate?: (object: go.GraphObject, event: go.InputEvent) => boolean;
  enabledPredicate?: (object: go.GraphObject, event: go.InputEvent) => boolean;
  textPredicate?: (object: go.GraphObject, event: go.InputEvent) => string;
}

interface ButtonArguments extends SimpleButtonArguments {
  row: number;
}

interface MenuButtonArguments extends ButtonArguments {
  subMenuNames: string[];
}

interface ContextMenuParams extends SimpleButtonArguments {
  subButtonArguments?: (SimpleButtonArguments & { name: string })[];
}

@Injectable()
export class ContextMenuService {

  constructor() {
    thisService = this;
  }

  crateSimpleContextMenu(buttonArguments: SimpleButtonArguments[]): go.Adornment {

    const menuButtons = buttonArguments.map(
      function(buttonArg: SimpleButtonArguments): go.Panel {
        return $(
          'ContextMenuButton',
          $(go.TextBlock,
            buttonArg.text,
            {}
          ),
          {
            click: buttonArg.action
          }
        );
      }
    );

    return $(
      'ContextMenu',
      ...menuButtons
    );
  }

  createTwoLevelContextMenu(name: string, buttonArguments: ContextMenuParams[]): go.Adornment {
    const menuButtons = buttonArguments.map(
      function(buttonArg: ContextMenuParams, index: number): go.Panel {
        if (buttonArg.subButtonArguments && buttonArg.subButtonArguments.length > 0) {

          const subMenuButtonNames = buttonArg.subButtonArguments.map(
            function(subButtonArg) {return subButtonArg.name; }
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

    buttonArguments.forEach(
      function(buttonArg, index) {
        if (buttonArg.subButtonArguments && buttonArg.subButtonArguments.length > 0) {
          const subButtons = buttonArg.subButtonArguments.map(
            function(subButtonArg, subIndex) {
              return thisService.makeSubMenubutton(
                {
                  row: index + subIndex,
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
      $(go.Panel, 'Table',
        {
          alignment: new go.Spot(1, 0, -20, 0),
          alignmentFocus: go.Spot.TopLeft
        },
        ...menuButtons,
        ...subMenuButtons
      )
    );
  }

  makeButton(args: ButtonArguments): go.Panel {
    return $(
      'ContextMenuButton',
      {
        name: args.text,
        click: function(event, object): void {
          args.action(event, object);
          ((object.part as go.Adornment).adornedObject as go.Node)
            .removeAdornment('ButtonMenu');
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
        new go.Binding('stroke', 'isEnabled', function(enabled) {
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
            return args.visiblePredicate(object, event);
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
          thisService.diagramChangesService.updateViewAreaForMenu(menu);

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
            return args.visiblePredicate(object, event);
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
    args: ButtonArguments
  ): go.Panel {
    return $('ContextMenuButton',
      {
        click: function(event: go.InputEvent, object: go.Panel): void {
          args.action(event, object);
          ((object.part as go.Adornment).adornedObject as go.Node)
            .removeAdornment('ButtonMenu');
        },
        mouseEnter: thisService.standardMouseEnter,
        name: args.text,
        visible: false,
        column: 1,
        row: args.row
      },
      $(go.TextBlock,
        args.textPredicate
          ? new go.Binding('text', '', args.textPredicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(name)
      ),
      args.enabledPredicate
        ? new go.Binding('isEnabled', '', args.enabledPredicate).ofObject()
        : {},
      args.visiblePredicate
        ? new go.Binding('height', '', function(object: go.GraphObject, event: go.InputEvent) {
          return args.visiblePredicate(object, event) ? 20 : 0;
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
