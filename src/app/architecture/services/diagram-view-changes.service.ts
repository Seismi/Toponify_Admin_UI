import {Injectable} from '@angular/core';
import {DiagramLevelService, Level} from '@app/architecture/services/diagram-level.service';
import {MatDialog} from '@angular/material';
import * as go from 'gojs';
import {linkCategories} from '@app/architecture/store/models/node-link.model';
import {DiagramUtilitiesService} from '@app/architecture/services/diagram-utilities-service';
import {Subject} from 'rxjs';

let thisService: DiagramViewChangesService;

@Injectable()
export class DiagramViewChangesService {
  public diagramEditable: boolean;
  private currentLevel: Level;
  public dependenciesView = false;
  public showHideGridSource = new Subject();
  public showHideGrid$ = this.showHideGridSource.asObservable();
  // Observable to indicate that the diagram should be zoomed in or out
  public zoomSource = new Subject();
  public zoom$ = this.zoomSource.asObservable();
  // Observable to indicate that the detail tab should be displayed
  public showRightPanelTabSource = new Subject();
  public showRightPanelTab$ = this.showRightPanelTabSource.asObservable();
  // Observable to indicate that the radio alert should be toggled
  public showHideRadioAlertSource = new Subject();
  public showHideRadioAlert$ = this.showHideRadioAlertSource.asObservable();

  constructor(
    public diagramLevelService: DiagramLevelService,
    public diagramUtilitiesService: DiagramUtilitiesService,
    public dialog: MatDialog,
  ) {
    thisService = this;
  }

  // Update diagram when display options have been changed
  updateDisplayOptions(event: any, option: string, diagram: go.Diagram): void {
    // If option to show master data links disabled then deselect any master data links
    if (option === 'masterDataLinks' && !event.checked) {
      diagram.selection.each(function(part) {
        if (part instanceof go.Link && part.category === linkCategories.masterData) {
          part.isSelected = false;
        }
      });
    } else if (option === 'dataLinks' && !event.checked) {
      diagram.selection.each(function(part) {
        if (part instanceof go.Link && part.category === linkCategories.data) {
          part.isSelected = false;
        }
      });
    }

    // Redo layout for node usage view after updating display options
    if (this.currentLevel === Level.usage) {
      diagram.layout.isValidLayout = false;
    } else {
      // Update the route of links after display change
      diagram.links.each(
        function(link) {
          // Set data property to indicate that link route should be updated
          diagram.model.setDataProperty(link.data, 'updateRoute', true);
          link.updateRoute();
        }.bind(this)
      );
    }
  }

  // Hide all nodes except the specified node and all nodes directly linked to it
  hideNonDependencies(depNode: go.Node): void {
    depNode.diagram.startTransaction('Analyse Dependencies');

    // Highlight specified node with a thicker blue shadow
    thisService.setBlueShadowHighlight(depNode, true);

    const nodesToStayVisible = this.getNodesToShowDependencies(depNode);

    if (nodesToStayVisible) {
      this.dependenciesView = true;
    }

    // Hide all non-directly-dependent nodes
    depNode.diagram.nodes.each(function(node) {
      if (!nodesToStayVisible.has(node)) {
        node.visible = false;
      }
    });

    // Update bindings so that the appropriate nodes show the button to expand dependency levels shown
    depNode.diagram.nodes.each(function(node) {
      if (node.visible) {
        node.updateTargetBindings();
      }
    });

    depNode.diagram.commitTransaction('Analyse Dependencies');

    // Centre diagram view on the specified node
    depNode.diagram.centerRect(depNode.actualBounds);
  }

  // Show all nodes that are directly linked to the specified node
  showDependencies(depNode: go.Node): void {
    depNode.diagram.startTransaction('Show Dependencies');

    const nodesToShow = this.getNodesToShowDependencies(depNode);

    nodesToShow.each(function(node) {
      node.visible = true;
    });

    // Update bindings so that the appropriate nodes show the button to expand dependency levels shown
    depNode.diagram.nodes.each(function(node) {
      if (node.visible) {
        node.updateTargetBindings();
      }
    });

    depNode.diagram.commitTransaction('Show Dependencies');
  }

  // Get a set of all nodes that need to be visible to show dependencies from the given input node
  getNodesToShowDependencies(depNode: go.Node): go.Set<go.Part> {
    // Get direct dependencies
    const dependencies = new go.Set<go.Part>([depNode]);
    dependencies.addAll(depNode.findNodesConnected());

    // Get any top-level groups containing the direct dependencies
    const groups = new go.Set<go.Group>();
    dependencies.each(function(node) {
      const topPart = node.findTopLevelPart();
      if (topPart instanceof go.Group) {
        groups.add(topPart);
      }
    });

    // Get all members of the groups containing direct dependencies
    const members = new go.Set<go.Part>();
    groups.each(function(group) {
      members.addAll(group.findSubGraphParts());
    });

    return new go.Set<go.Part>(dependencies).addAll(groups).addAll(members);
  }

  // Set all nodes in the specified diagram to visible
  showAllNodes(diagram: go.Diagram): void {
    diagram.startTransaction('Show All Nodes');

    // Set all nodes to visible and reset shadow
    diagram.nodes.each(
      function(node) {
        node.visible = true;
        thisService.setBlueShadowHighlight(node, false);
      }
    );

    this.dependenciesView = false;

    // Update bindings so that nodes no longer show the button to expand dependency levels
    diagram.nodes.each(function(node) {
      node.updateTargetBindings();
    });

    diagram.commitTransaction('Show All Nodes');
  }

  // Expands the currently viewed area of the diagram to include the given menu
  updateViewAreaForMenu(menu: go.Adornment) {
    const diagram = menu.diagram;

    menu.ensureBounds();
    // Expand diagram area to include the menu
    diagram.documentBounds.unionRect(menu.actualBounds);
    // Calculate new view area based on current view area and menu bounds
    const updatedViewArea = diagram.viewportBounds.copy().unionRect(menu.actualBounds);
    // Scroll screen to calculated view area
    diagram.scrollToRect(updatedViewArea);
  }

  // Update z order to ensure that the last selected parts are on top, as well as keeping
  //  group members further forward from their containing groups.
  updateZOrder(diagram: go.Diagram): void {
    let maxZ = 0;
    // First assign all nodes a z order equal to how deeply nested in groups they are
    diagram.nodes.each(function(node) {
      node.zOrder = node.findSubGraphLevel();
      // Track maximum z order assigned
      maxZ = Math.max(0, node.zOrder);
    });

    // Assign selection (and members of selected groups) the largest z order
    diagram.selection.each(function(part) {
      // Selection z order
      part.zOrder = maxZ + 1 + part.findSubGraphLevel();
      if (part instanceof go.Group) {
        part.findSubGraphParts().each(function(subPart) {
          // Nested group member z order
          subPart.zOrder = maxZ + 1 + subPart.findSubGraphLevel();
        });
      }
    });

    // Set z order for links
    diagram.links.each(function(link) {
      if (link.fromNode && link.toNode) {
        // Connected links to have same z order as frontmost connected node
        link.zOrder = Math.max(link.fromNode.zOrder, link.toNode.zOrder);
      } else {
        // Disconnected links always appear at the front
        link.zOrder = maxZ * 2 + 2;
      }
    });
  }

  setBlueShadowHighlight(node: go.Node, highlight: boolean): void {
    node.shadowColor = highlight ? 'blue' : 'gray';
    node.shadowBlur = highlight ? 18 : 4;
  }
}
