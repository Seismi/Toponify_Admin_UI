import {Injectable} from '@angular/core';
import * as go from 'gojs';

let thisService;

const $ = go.GraphObject.make;
const disabledTextColour = '#707070';

interface SimpleButtonArguments {
  text: string;
  action: (event: go.InputEvent, object?: go.GraphObject) => void;
  visible_predicate?: (object: go.GraphObject, event: go.InputEvent) => boolean;
  enabled_predicate?: (object: go.GraphObject, event: go.InputEvent) => boolean;
  text_predicate?: (object: go.GraphObject, event: go.InputEvent) => string;
}

interface ButtonArguments extends SimpleButtonArguments {
  row: number;
}

interface MenuButtonArguments extends ButtonArguments {
  subMenuNames: string[];
}

@Injectable()
export class ContextMenuService {

  constructor() {
    thisService = this;
  }

  crateSimpleContextMenu(buttonArguments: SimpleButtonArguments[]) {

    const menuButtons = buttonArguments.map(
      function(buttonArg) {
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

  createTwoLevelContextMenu(name: string, buttonArguments) {
    const menuButtons = buttonArguments.map(
      function(buttonArg, index) {
        if (buttonArg.subButtonArguments && buttonArg.subButtonArguments.length > 0) {

          const subMenuButtonNames = buttonArg.subButtonArguments.map(
            function(subButtonArg) {return subButtonArg.name; }
          );

          thisService.makeMenuButton(
            {
              row: index + 1,
              subMenuNames: subMenuButtonNames,
              ...buttonArg
            }
          );
        } else {
          thisService.makeButton(
            {
              row: index + 1,
              ...buttonArg
            }
          );
        }
      }
    );

    const subMenuButtons = [];

    buttonArguments.each(
      function(buttonArg, index) {
        if (buttonArg.isMenuButton) {
          const subButtons = buttonArg.subMenuArguments.map(
            function(subButtonArg, subIndex) {
              return thisService.makeSubMenubutton(
                {
                  row: index + subIndex + 1,
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

  makeButton(
    args: ButtonArguments
  ): go.Part {
    return $(
      'ContextMenuButton',
      {
        name: args.text
      },
      $(go.TextBlock,
        args.text_predicate
          ? new go.Binding('text', '', args.text_predicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(args.text)
      ),
      {
        click: function(event, object) {
          args.action(event, object);
          ((object.part as go.Adornment).adornedObject as go.Node)
            .removeAdornment('ButtonMenu');
        },
        column: 0,
        row: args.row,
        mouseEnter: function(event: object, object: go.Part) {
          thisService.standardMouseEnter(event, object);
          // Hide any open submenu when user mouses over button
          object.panel.elements.each(function(button: go.Part) {
            if (button.column === 1) {
              button.visible = false;
            }
          });
        }
      },
      // Don't bother with binding GraphObject.visible if there's no predicate
      args.visible_predicate
        ? new go.Binding('visible', '', function(
        object: go.Part,
        event: go.InputEvent
        ): boolean {
          if (object.diagram) {
            return args.visible_predicate(object, event);
          } else {
            return false;
          }
        }).ofObject()
        : {},
      args.enabled_predicate
        ? new go.Binding('isEnabled', '', args.enabled_predicate).ofObject()
        : {}
    );
  }

  makeMenuButton(
    args: MenuButtonArguments
  ): go.Part {
    return $('ContextMenuButton',
      {
        name: args.text
      },
      $(go.TextBlock,
        args.text_predicate
          ? new go.Binding('text', '', args.text_predicate).ofObject()
          : { text: args.text },
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(args.text)
      ),
      {
        mouseEnter: function(event: go.InputEvent, object: go.Part): void {

          const menu = object.part as go.Adornment;

          thisService.standardMouseEnter(event, object);
          // Hide any open submenu that is already open
          object.panel.elements.each(function(button: go.Part): void {
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
      // Don't bother with binding GraphObject.visible if there's no predicate
      args.visible_predicate
        ? new go.Binding('visible', '', function(
        object: go.Part,
        event: object
        ): boolean {
          if (object.diagram) {
            return args.visible_predicate(object, event);
          } else {
            return false;
          }
        }).ofObject()
        : {},
      args.enabled_predicate
        ? new go.Binding('isEnabled', '', args.enabled_predicate).ofObject()
        : {}
    );
  }

  // Button to appear when a menu button is moused over
  makeSubMenuButton(
    args: MenuButtonArguments
  ): go.Part {
    return $('ContextMenuButton',
      {
        name: name
      },
      $(go.TextBlock,
        args.text_predicate
          ? new go.Binding('text', '', args.text_predicate).ofObject()
          : { text: name },
        new go.Binding('stroke', 'isEnabled', function(enabled) {
          return enabled ? 'black' : disabledTextColour;
        }).ofObject(name)
      ),
      {
        click: function(event, object) {
          args.action(event, object);
          ((object.part as go.Adornment).adornedObject as go.Node)
            .removeAdornment('ButtonMenu');
        },
        name: name,
        visible: false,
        column: 1,
        row: args.row
      },
      args.enabled_predicate
        ? new go.Binding('isEnabled', '', args.enabled_predicate).ofObject()
        : {},
      args.visible_predicate
        ? new go.Binding('height', '', function(object: go.GraphObject, event: object) {
          return args.visible_predicate(object, event) ? 20 : 0;
        }).ofObject()
        : {}
    );
  }

  standardMouseEnter(e: object, btn: go.Part): void {
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
