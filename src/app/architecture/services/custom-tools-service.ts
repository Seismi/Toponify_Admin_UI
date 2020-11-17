import {Injectable} from '@angular/core';
import {LinkShiftingTool} from '@app/architecture/official-gojs-extensions/LinkShiftingTool';
import * as go from 'gojs';
import {UndoLayoutChange} from '@app/architecture/store/actions/node.actions';
import {Store} from '@ngrx/store';
import {RouterReducerState} from '@ngrx/router-store';
import {RouterStateUrl} from '@app/core/store';
import {GuidedDraggingTool} from '@app/architecture/official-gojs-extensions/GuidedDraggingTool';
import {endPointTypes, layers, nodeCategories} from '@app/architecture/store/models/node.model';
import {dummyLinkId} from '@app/architecture/store/models/node-link.model';
import {Subject} from 'rxjs';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {DiagramPartTemplatesService} from '@app/architecture/services/diagram-part-templates.service';
import {DiagramStructureChangesService} from '@app/architecture/services/diagram-structure-changes.service';
import {DiagramLevelService} from '@app/architecture/services/diagram-level.service';

let thisService: CustomToolsService;

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
    let port;
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

    if (!port) { return; }
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

    // Use default minimum size if node is not a group
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


// Custom command handler to handle keyboard commands
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
      // Ctrl+Z sends command to undo the last layout change
      thisService.store.dispatch(new UndoLayoutChange());
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

      thisService.arrowKeyMoveSource.next();

      // Update position in the store for moved nodes and connected links
      thisService.diagramLayoutChangesService.updatePosition({ subject: effectiveSelection, diagram: diagram });
    } else {
      super.doKeyUp();
    }
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
      otherNode = thisService.diagramUtilitiesService.getFirstVisibleGroup(otherNode);
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


/*
This service defines any custom/customised tools used by the diagram.
Tools enable different ways of interacting with the diagram.
*/

@Injectable()
export class CustomToolsService {
  // Observable to flag that the last action performed was moving parts using the arrow keys
  public arrowKeyMoveSource = new Subject();
  public arrowKeyMove$ = this.arrowKeyMoveSource.asObservable();

  constructor(
    public store: Store<RouterReducerState<RouterStateUrl>>,
    public diagramLayoutChangesService: DiagramLayoutChangesService,
    public diagramUtilitiesService: DiagramUtilitiesService,
    private diagramPartTemplatesService: DiagramPartTemplatesService,
    private diagramStructureChangesService: DiagramStructureChangesService,
    private diagramLevelService: DiagramLevelService
  ) {
    thisService = this;
  }

  // Set up all custom tools and settings
  enableCustomTools(diagram: go.Diagram): void {

    const toolManager = diagram.toolManager;
    const draggingTool = new GuidedDraggingTool();
    const relinkingTool = new CustomRelinkingTool();
    const commandHandler = new CustomCommandHandler();

    // Custom dragging tool with guidelines
    toolManager.draggingTool = draggingTool;
    draggingTool.horizontalGuidelineColor = 'blue';
    draggingTool.verticalGuidelineColor = 'blue';
    draggingTool.centerGuidelineColor = 'green';
    draggingTool.dragsLink = true;
    thisService.customDoActivate(diagram.toolManager.draggingTool);
    thisService.customDragMouseMove(diagram.toolManager.draggingTool);
    thisService.customDoDropOnto(diagram.toolManager.draggingTool);

    // Link shifting tool to move link endpoints on source or target node
    toolManager.mouseDownTools.add(new CustomLinkShift());

    // Drag/drop new links from palette rather using than the standard linking tool
    toolManager.linkingTool.isEnabled = false;

    // Settings for relinking links
    relinkingTool.isUnconnectedLinkValid = true;
    relinkingTool.portGravity = 40;
    relinkingTool.linkValidation = thisService.linkingValidation;

    toolManager.resizingTool = new CustomNodeResize();

    // Set context menu
    diagram.contextMenu = thisService.diagramPartTemplatesService.getBackgroundContextMenu();

    // Override command handler delete method to emit delete event to angular
    thisService.customDeleteSelection(commandHandler);

  }

  customDoActivate(draggingTool: go.DraggingTool): void {

    // Override standard doActivate method on dragging tool to disable guidelines when dragging a link
    draggingTool.doActivate = function(): void {
      go.DraggingTool.prototype.doActivate.call(this);

      const draggedParts = this.draggedParts.toKeySet();

      // Only use drag guidelines for nodes and not for links
      this.isGuidelineEnabled = draggedParts.first() instanceof go.Node;

      // If the only part being dragged is a link that is already connected, cancel the drag
      if (draggedParts.count === 1 && draggedParts.first() instanceof go.Link) {
        const draggedLink = draggedParts.first();

        if (!draggedLink.data.isTemporary) {
          go.DraggingTool.prototype.doCancel.call(this);

          // Cancelling the drag loses the link's selection adornment. Therefore, reselect the link to get it back.
          draggedLink.isSelected = false;
          this.diagram.select(draggedLink);
        }
      }
    };

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
        const droppedNode = thisService.diagramUtilitiesService.getGroupableDraggedNode(draggingTool);

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
            } else if (thisService.diagramStructureChangesService.diagramEditable) {
              thisService.diagramStructureChangesService.setSystemGroupSource.next({
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

  customHideContextMenu(contextMenuTool: go.ContextMenuTool): void {

    // Override standard hideContextMenu method on context menu tool to also hide any opened sub-menus
    contextMenuTool.hideContextMenu = function(): void {
      if (this.currentContextMenu) {
        this.currentContextMenu.elements.each(function(button: go.Part): void {
          if (button.column === 1) {
            button.visible = false;
          }
        });
      }
      // After hiding submenus, perform standard hideContextMenu process
      go.ContextMenuTool.prototype.hideContextMenu.call(this);
    };
  }

  customDeleteSelection(commandHandler: go.CommandHandler): void {

    // Override command handler delete method to emit delete event to angular
    commandHandler.deleteSelection = function(): void {
      // TEMP - no deletes for multiple parts for now
      if (this.diagram.selection.count !== 1) {
        return;
      }

      const deletedPart = this.diagram.selection.first();

      // Disallow delete of dummy links in map view
      if (deletedPart.data.id === dummyLinkId) {
        return;
      }

      // Delete links that have not yet been connected to a node at both ends
      if (deletedPart.data.isTemporary) {
        go.CommandHandler.prototype.deleteSelection.call(this.diagram.commandHandler);
        return;
      }

      if (deletedPart instanceof go.Node) {
        // Disallow deleting group member of shared node
        if (deletedPart.containingGroup && deletedPart.containingGroup.data.isShared) {
          return;
        }

        this.nodeDeleteRequested.emit(deletedPart.data);
      } else {
        // part to be deleted is a link
        this.linkDeleteRequested.emit(deletedPart.data);
      }
    }.bind(this);
  }

  // Stops invalid links being created
  linkingValidation(
    fromnode: go.Node,
    fromport: go.GraphObject,
    tonode: go.Node,
    toport: go.GraphObject,
    oldlink: go.Link
  ): boolean {
    // Ensure that links in map view go in the right direction
    if (thisService.diagramLevelService.isInMapView()) {
      if (fromnode && fromnode.containingGroup && fromnode.containingGroup.data.endPointType !== endPointTypes.source) {
        return false;
      }
      if (tonode && tonode.containingGroup && tonode.containingGroup.data.endPointType !== endPointTypes.target) {
        return false;
      }
    }

    // Only validate links that are connected at both ends
    if (!fromnode || !tonode) {
      return true;
    }

    // Prevent links between two transformation nodes
    if (
      fromnode.data.category === nodeCategories.transformation &&
      tonode.data.category === nodeCategories.transformation
    ) {
      return false;
    }

    // Prevent links to transformation node in more than one direction
    if (
      fromnode.data.category === nodeCategories.transformation ||
      tonode.data.category === nodeCategories.transformation
    ) {
      const allLinks = tonode.findLinksTo(fromnode);
      if (allLinks.count > 0) {
        return false;
      }
    }

    // Prevent links between equivalent nodes in map view
    if (thisService.diagramLevelService.isInMapView()) {
      if (fromnode.data.id === tonode.data.id) {
        return false;
      }
    }

    return true;
  }
}
