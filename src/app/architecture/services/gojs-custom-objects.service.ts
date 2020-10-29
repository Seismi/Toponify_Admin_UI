import * as go from 'gojs';
import {LinkShiftingTool} from 'gojs/extensionsTS/LinkShiftingTool';
import {forwardRef, Inject, Injectable} from '@angular/core';
import {DiagramLevelService, Level} from './diagram-level.service';
import {Subject} from 'rxjs';
import {layers, bottomOptions, nodeCategories, NodeDetail} from '@app/architecture/store/models/node.model';
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

  // Adjust doReshape method to connect the link to the linked node's containing
  //  group if this group is collapsed.
  doReshape(pt: go.Point): void {
    const ad = this['_handle'].part as go.Adornment;
    const link = ad.adornedObject.part as go.Link;
    const fromEnd = ad.category === 'LinkShiftingFrom';
    let connectedNode;
    let port = null;
    if (fromEnd) {
      connectedNode = link.fromNode;
      port = link.fromPort;
    } else {
      connectedNode = link.toNode;
      port = link.toPort;
    }

    if (connectedNode === null) { return; }

    // Use port on node's containing group if containing group is collapsed
    while (connectedNode.containingGroup && !connectedNode.containingGroup.isSubGraphExpanded) {
      connectedNode = connectedNode.containingGroup;
      port = connectedNode.port;
    }

    if (port === null) { return; }
    // support rotated ports
    const portAng = port.getDocumentAngle();
    const center = port.getDocumentPoint(go.Spot.Center);
    const portB = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft).subtract(center).rotate(-portAng).add(center),
      port.getDocumentPoint(go.Spot.BottomRight).subtract(center).rotate(-portAng).add(center));
    let lp = link.getLinkPointFromPoint(port.part, port, center, pt, fromEnd);
    lp = lp.copy().subtract(center).rotate(-portAng).add(center);
    const spot = new go.Spot(Math.max(0, Math.min(1, (lp.x - portB.x) / (portB.width || 1))),
      Math.max(0, Math.min(1, (lp.y - portB.y) / (portB.height || 1))));
    if (fromEnd) {
      link.fromSpot = spot;
    } else {
      link.toSpot = spot;
    }
  }
}

// Custom resizing tool to resize system/data groups
export class CustomNodeResize extends go.ResizingTool {
  constructor() {
    super();
  }

  doActivate() {
    go.ResizingTool.prototype.doActivate.call(this);

    if (this.adornedObject.part instanceof go.Group) {
      this.adornedObject.part.findSubGraphParts().each(
        function(node) {
          node.data.tempSavedPosition = node.position.copy();
        }
      );
    }
  }

  // Constrain minimum size to encompass all system/data group members
  public computeMinSize(): go.Size {

    // Default minimum size irrespective of group members
    const minSize = go.ResizingTool.prototype.computeMinSize.call(this);

    // Use default minumum size if node is not a group
    if (!(this.adornedObject.part instanceof go.Group)) {
      return minSize;
    }

    const group = this.adornedObject.part as go.Group;

    if (group.isSubGraphExpanded) {

      // Determine which way/ways the group is being enlarged
      //  based on alignment of the resizing handle being dragged
      const draggedSides = {
        top: this.handle.alignment.y === 0,
        right: this.handle.alignment.x === 1,
        bottom: this.handle.alignment.y === 1,
        left: this.handle.alignment.x === 0
      };

      // Get bounds of current group member area
      const memberArea = this.adornedObject.panel.findObject('Group member area').getDocumentBounds();
      const extra = 130;

      // For each direction the group is being enlarged in,
      //  ensure that no grouped node would be left outside the group member area
      group.memberParts.each(
        function(node: go.Part) {
          // Ignore links between nodes in the group
          if (node instanceof go.Node) {

            // Prevent the top side of the group being dragged too low
            if (draggedSides.top) {
              minSize.height = Math.max(minSize.height, extra + memberArea.bottom - node.actualBounds.top);
            }
            // Prevent the right side of the group being dragged too far left
            if (draggedSides.right) {
              minSize.width = Math.max(minSize.width, node.actualBounds.right - memberArea.left);
            }
            // Prevent the bottom side of the group being dragged too high
            if (draggedSides.bottom) {
              minSize.height = Math.max(minSize.height, extra + node.actualBounds.bottom - memberArea.top);
            }
            // Prevent the left side of the group being dragged too far right
            if (draggedSides.left) {
              minSize.width = Math.max(minSize.width, memberArea.right - node.actualBounds.left);
            }
          }
        }
      );
    }

    return minSize;
  }

  public computeMaxSize(): go.Size {

    // Default maximum size irrespective of group membership
    const maxSize = go.ResizingTool.prototype.computeMaxSize.call(this);
    const group = this.adornedObject.part as go.Group;

    // If group is itself contained in a group then ensure that the group is not
    //  expanded outside the bounds of its containing group
    if (group.containingGroup && group.containingGroup.category !== '') {

      // Determine which way/ways the group is being enlarged
      //  based on alignment of the resizing handle being dragged
      const draggedSides = {
        top: this.handle.alignment.y === 0,
        right: this.handle.alignment.x === 1,
        bottom: this.handle.alignment.y === 1,
        left: this.handle.alignment.x === 0
      };

      const containingArea = group.containingGroup.findObject('Group member area').getDocumentBounds();
      const groupArea = group.getDocumentBounds();

      if (draggedSides.top) {
        maxSize.height = Math.min(maxSize.height, groupArea.bottom - containingArea.top - 10);
      }

      if (draggedSides.right) {
        maxSize.width = Math.min(maxSize.width, containingArea.right - groupArea.left - 10);
      }

      if (draggedSides.bottom) {
        maxSize.height = Math.min(maxSize.height, containingArea.bottom - groupArea.top - 10);
      }

      if (draggedSides.left) {
        maxSize.width = Math.min(maxSize.width, groupArea.right - containingArea.left - 10);
      }
    }

    return maxSize;
  }

  // Override standard resize in order to prevent grouped nodes from shifting position
  public resize(newr: go.Rect): void {
    // Perform standard resizing
    go.ResizingTool.prototype.resize.call(this, newr);

    if (this.adornedObject.part instanceof go.Group) {
      // Restore grouped node's positions from before the resizing
      this.adornedObject.part.findSubGraphParts().each(
        function (node) {
          node.position = node.data.tempSavedPosition;
        }
      );
    }
  }

  doDeactivate() {
    if (this.adornedObject.part instanceof go.Group) {
      // Remove temporary saved position from node data
      this.adornedObject.part.findSubGraphParts().each(
        function (node) {
          delete node.data.tempSavedPosition;
        }
      );
    }
    return go.ResizingTool.prototype.doDeactivate.call(this);
  }
}

export class CustomCommandHandler extends go.CommandHandler {
  constructor() {
    super();
  }

  public doKeyDown(): void {
    const diagram = this.diagram;
    const input = diagram.lastInput;

    // Handle node positioning from pressing the arrow keys
    if (['Up', 'Down', 'Left', 'Right'].includes(input.key) && diagram.allowMove) {
      const nodesToMove = new go.Set<go.Node>();
      const selectedNodes = new go.Set<go.Node>();

      diagram.selection.each(function(selectedPart: go.Part): void {
        if (selectedPart instanceof go.Node) {
          selectedNodes.add(selectedPart);
        }
      });

      // Only include selected nodes that do not have any containing node selected,
      //  as group member nodes are automatically kept aligned with their containing
      //  groups on move.
      selectedNodes.each(function(node: go.Node): void {
        const containingGroups = new go.Set<go.Group>();
        for (let grp = node; grp.containingGroup; grp = grp.containingGroup) {
          containingGroups.add(grp.containingGroup);
        }
        if (!selectedNodes.containsAny(containingGroups)) {
          nodesToMove.add(node);
        }
      });

      // Get vertical and horizontal change in node position depending on which arrow
      //  keys are pressed
      let vChange = 0;
      let hChange = 0;

      if (input.key === 'Up') {
        vChange = -1;
      } else if (input.key === 'Down') {
        vChange = 1;
      } else if (input.key === 'Left') {
        hChange = -1;
      } else {
        hChange = 1;
      }

      // Move amount equal to the grid cell size on each keypress.
      //  If control held down, move only one unit.
      if (diagram.grid && !input.control) {
        vChange = vChange * diagram.grid.gridCellSize.height;
        hChange = hChange * diagram.grid.gridCellSize.width;
      }

      // Check attempted move is valid for all nodes to be moved
      const canMove = nodesToMove.all(function(node: go.Node): boolean {
        const newBounds = node.getDocumentBounds().copy().offset(hChange, vChange);
        if (node.containingGroup) {
          const groupMemberArea = node.containingGroup.findObject('Group member area').getDocumentBounds();
          // Check node is not being moved outside of its group
          if (!groupMemberArea.containsRect(newBounds)) {
            return false;
          }
        }
        return true;
      });

      // Abort move if any node move not valid
      if (!canMove) {
        return;
      }

      // Move the nodes
      nodesToMove.each(function(node: go.Node): void {
        node.moveTo(node.position.x + hChange, node.position.y + vChange);
      });

      // Get all nodes affected by the move, explicitly or implicitly
      const affectedNodes = new go.Set<go.Node>();
      // Selected nodes
      affectedNodes.addAll(selectedNodes);
      // Group member nodes
      selectedNodes.each(function(node: go.Node): void {
        if (node instanceof go.Group) {
          node.findSubGraphParts().each(function (part: go.Part): void {
            if (part instanceof go.Node) {
              affectedNodes.add(part);
            }
          });
        }
      });

      // Get any links connected to nodes affected by the move
      const linksToUpdate = new go.Set<go.Link>();
      affectedNodes.each(function(node: go.Node): void {
        linksToUpdate.addAll(node.findLinksConnected());
      });

      // Update link routes for links connected to affected nodes
      linksToUpdate.each(function(link: go.Link): void {
        link.data.updateRoute = true;
        link.updateRoute();
      });

    } else if (input.key === 'Z' && input.control) {
      currentService.store.dispatch(new UndoLayoutChange());
    } else {
      super.doKeyDown();
    }
  }

  public doKeyUp(): void {
    const diagram = this.diagram;
    const input = diagram.lastInput;

    // Handle nodes moved using the arrow keys
    if (['Up', 'Down', 'Left', 'Right'].includes(input.key) && diagram.allowMove) {
      const effectiveSelection = new go.Set<go.Part>();

      // Get all nodes affected by the move
      diagram.selection.each(function(part: go.Part): void {
        // selected nodes
        if (part instanceof go.Node) {
          effectiveSelection.add(part);
        }
        // Subgraph parts
        if (part instanceof go.Group) {
          effectiveSelection.addAll(part.findSubGraphParts());
        }
      });

      currentService.arrowKeyMoveSource.next();

      // Update position in the store for moved nodes and connected links
      currentService.diagramChangesService.updatePosition({ subject: effectiveSelection, diagram: diagram });
    } else {
      super.doKeyUp();
    }
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

    if (this.data.isTemporary) {
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

// Custom relinking tool to handle reconnecting links that connect to a member of a collapsed group
export class CustomRelinkingTool extends go.RelinkingTool {

  // On mouse move, if the non-dragged end of the link is connected to a member of a collapsed
  //  group then act as if the link were connected to the group.
  doMouseMove(): void {
    let otherNode = this.isForwards ? this['originalFromNode'] : this['originalToNode'];
    const tempOtherNode = this.isForwards ? this['temporaryFromNode'] : this['temporaryToNode'];
    const tempOtherPort = this.isForwards ? this['temporaryFromPort'] : this['temporaryToPort'];

    // Determine first containing group to not be within a collapsed group
    if (otherNode) {
      otherNode = currentService.diagramChangesService.getFirstVisibleGroup(otherNode);
      tempOtherNode.position = otherNode.position;
      tempOtherNode.desiredSize = otherNode.getDocumentBounds().inflate(0.5, 0.5).size;
      tempOtherPort.desiredSize = otherNode.getDocumentBounds().inflate(-0.5, -0.5).size;
    }

    go.RelinkingTool.prototype.doMouseMove.call(this);
  }

  // Prevent link from becoming disconnected if no target node on mouse up
  doMouseUp(): void {
    if (!this.targetPort) {
      this.doCancel();
    }
    go.RelinkingTool.prototype.doMouseUp.call(this);
  }
}

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
  action: (event: go.InputEvent, object?: go.GraphObject) => void,
  visible_predicate?: (object: go.GraphObject, event: go.InputEvent) => boolean,
  enabled_predicate?: (object: go.GraphObject, event: go.InputEvent) => boolean,
  text_predicate?: (object: go.GraphObject, event: go.InputEvent) => string
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
      event: go.InputEvent
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

// Button to show a submenu when moused over
function makeMenuButton(
  row: number,
  text: string,
  subMenuNames: string[],
  visible_predicate?: (object: go.Part, event: object) => boolean,
  text_predicate?: (object: go.GraphObject, event: object) => string,
  enabled_predicate?: (object: go.Part, event: object) => boolean
): go.Part {
  return $('ContextMenuButton',
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
      mouseEnter: function(event: go.InputEvent, object: go.Part): void {

        const menu = object.part as go.Adornment;

        standardMouseEnter(event, object);
        // Hide any open submenu that is already open
        object.panel.elements.each(function(button: go.Part): void {
          if (button.column === 1) {
            button.visible = false;
          }
        });

        if (!object.isEnabled) {return; }

        // Show any submenu buttons assigned to this menu button
        subMenuNames.forEach(function(buttonName: string): void {
          menu.findObject(buttonName).visible = true;
        });

        // Ensure that opened submenus do not appear outside of diagram bounds
        currentService.diagramChangesService.updateViewAreaForMenu(menu);

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
            const node = (object.part as go.Adornment).adornedObject as go.Node;
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

  // Override the doMouseMove method for the dragging tool.
  // Implements scrolling when the mouse cursor is past the diagram
  //  when parts are being dragged.
  customDragMouseMove(draggingTool: go.DraggingTool): void {
    draggingTool.doMouseMove = function(): void {
      const diagram = draggingTool.diagram;

      const viewRect = diagram.viewportBounds.copy();

      // Get all parts being dragged
      const partsDragging = draggingTool.draggedParts.iteratorKeys;

      // Calculate smallest area that contains all the dragged parts
      partsDragging.each(function(part: go.Part): void {
        viewRect.unionRect(part.getDocumentBounds());
      });

      // Scroll the diagram to keep dragged parts in view
      diagram.doAutoScroll(diagram.lastInput.viewPoint);
      draggingTool.diagram.scrollToRect(viewRect);

      // Do standard doMouseMove actions
      go.DraggingTool.prototype.doMouseMove.call(draggingTool);
    };
  }

  // Override the doDropOnto method for the dragging tool.
  // Implements adding a node to a group via drop.
  customDoDropOnto(draggingTool: go.DraggingTool): void {
    draggingTool.doDropOnto = function(pt: go.Point, obj: go.GraphObject): void {
      // Only perform additional checks if dragged node is over an object
      if (obj) {

        const targetPart = obj.part || obj;
        const fromPalette = !!draggingTool.copiedParts;
        const droppedNode = currentService.diagramChangesService.getGroupableDraggedNode(draggingTool);

        // Continue only if a valid dropped node is dragged
        if (droppedNode) {

          // Check that target node is a group in the system layer
          if (targetPart instanceof go.Group
            && targetPart.data.layer === layers.system
          ) {
            if (fromPalette) {
              // If dragged from palette then set the group on the node's data.
              // the node will be created with the correct group.
              droppedNode.data.group = targetPart.data.id;
            } else if (currentService.diagramEditable) {
              currentService.setSystemGroupSource.next({
                memberId: droppedNode.data.id, groupId: targetPart.data.id
              });
            }
          }
        }
      }

      // Reset cursor on dropping node
      draggingTool.diagram.currentCursor = draggingTool.diagram.defaultCursor;

      // Do standard doDropOnto actions
      go.DraggingTool.prototype.doMouseMove.call(draggingTool);
    };
  }
}
