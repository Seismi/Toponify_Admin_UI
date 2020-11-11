import {Injectable} from '@angular/core';
import * as go from 'gojs';
import {endPointTypes, layers, nodeCategories} from '@app/architecture/store/models/node.model';

let thisService;

@Injectable()
export class DiagramUtilitiesService {

  constructor() {
    thisService = this;
  }

  textFont(style?: string): Object {
    const font = getComputedStyle(document.body).getPropertyValue('--default-font');
    return {
      font: `${style} ${font}`
    };
  }

  // Selects all parts in the diagram corresponding to an id
  //  in the given array. Used to reselect previously selected
  //  parts when the diagram's nodes or links are refreshed.
  preserveSelection(diagram: go.Diagram, selectionIds: string[]) {
    const previouslySelected = new go.Set<go.Part>();

    const newParts = new go.Set<go.Part>();
    newParts.addAll(diagram.nodes);
    newParts.addAll(diagram.links);

    newParts.each(function(part: go.Part) {
      const wasSelected = selectionIds.some(
        function(key: string): boolean {
          return part.key === key;
        }
      );
      if (wasSelected) {
        previouslySelected.add(part);
      }
    });

    diagram.selectCollection(previouslySelected);
  }

  linkingValidation(
    fromnode: go.Node,
    fromport: go.GraphObject,
    tonode: go.Node,
    toport: go.GraphObject,
    oldlink: go.Link
  ): boolean {
    // Ensure that links in map view go in the right direction
    if (this.currentLevel.endsWith('map')) {
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
    if (this.currentLevel.endsWith('map')) {
      if (fromnode.data.id === tonode.data.id) {
        return false;
      }
    }

    return true;
  }

  setBlueShadowHighlight(node: go.Node, highlight: boolean): void {
    node.shadowColor = highlight ? 'blue' : 'gray';
    node.shadowBlur = highlight ? 18 : 4;
  }

  // Check for any other nodes already occupying a given space
  isUnoccupied(rectangle: go.Rect, node: go.Node): boolean {
    const diagram = node.diagram;
    const dragFromPalette = !!diagram.toolManager.draggingTool.copiedParts;

    // nested function used by Layer.findObjectsIn, below
    // only consider Parts, and ignore the given Node, any Links, and Group members
    function navigate(obj: go.GraphObject): go.Part {

      const part = obj.part;

      if (part === node) {
        return null;
      }

      if (obj.name !== 'shape' && part.category === nodeCategories.transformation) {
        return null;
      }
      if (part instanceof go.Link) {
        return null;
      }
      if (part.isMemberOf(node)) {
        return null;
      }
      if (node.isMemberOf(part)) {
        return null;
      }
      if (diagram.selection.contains(part) && !dragFromPalette) {
        return null;
      }
      return part;
    }

    // only consider non-temporary Layers
    const diagramLayers = diagram.layers;
    while (diagramLayers.next()) {
      const layer = diagramLayers.value;
      if (layer.isTemporary) {
        continue;
      }
      if (layer.findObjectsIn(rectangle, navigate, null, true).count > 0) {
        return false;
      }
    }
    return true;
  }

  getFirstVisibleGroup(node: go.Group): go.Group {
    let returnGroup = node;
    while (returnGroup.containingGroup && !returnGroup.isVisible()) {
      returnGroup = returnGroup.containingGroup;
    }
    return returnGroup;
  }

  // If dragging a node suitable for being grouped then return the node.
  // Otherwise, return null.
  getGroupableDraggedNode(draggingTool: go.DraggingTool): go.Node | null {
    const draggedPartsMap = draggingTool.copiedParts || draggingTool.draggedParts;
    if (draggedPartsMap) {
      const draggedParts = draggedPartsMap.iteratorKeys;
      const groupableParts = new go.Set<go.Group>();

      // Find if any parts are valid to add to a group by dropping
      draggedParts.each(function(part: go.Group): void {
        if (part.isTopLevel
          && part instanceof go.Group
          && part.data.layer === layers.system
        ) {
          groupableParts.add(part);
        }
      });

      // Only allow dropping node into group if it is the only groupable node being dragged
      if (groupableParts.count === 1) {
        const groupableNode = groupableParts.first();

        // All other dragged parts must be nested members of the dragged group
        if (draggedParts.all(function(part: go.Part): boolean {
          return part === groupableNode
            || part.findTopLevelPart() === groupableNode;
        })
        ) {
          return groupableNode;
        }
      }
    }
    return null;
  }

  getMapViewSource(link: go.Link) {
    let mapViewSource: go.Part;

    // If link connects to a transformation node then use this node as the source of the map view.
    if (link.fromNode && link.fromNode.category === nodeCategories.transformation) {
      mapViewSource = link.fromNode;
    } else if (link.toNode && link.toNode.category === nodeCategories.transformation) {
      mapViewSource = link.toNode;
      // Otherwise, use the link as the source of the map view.
    } else {
      mapViewSource = link;
    }
  }

}
