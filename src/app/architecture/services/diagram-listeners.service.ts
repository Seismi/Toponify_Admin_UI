import * as go from 'gojs';
import { Injectable } from '@angular/core';
import {DiagramLevelService, Level} from './diagram-level.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import {getFilterLevelQueryParams, getNodeIdQueryParams} from '@app/core/store/selectors/route.selectors';
import {layers, bottomOptions} from '@app/architecture/store/models/node.model';
import {DiagramStructureChangesService} from '@app/architecture/services/diagram-structure-changes.service';
import {DiagramLayoutChangesService} from '@app/architecture/services/diagram-layout-changes.service';
import {DiagramViewChangesService} from '@app/architecture/services/diagram-view-changes.service';

let thisService: DiagramListenersService;

@Injectable()
export class DiagramListenersService {
  private nodeSelectedSource = new Subject();
  public partsSelected$ = this.nodeSelectedSource.asObservable();

  private modelChangedSource = new Subject();
  public modelChanged$ = this.modelChangedSource.asObservable();

  private nodeId: string;

  constructor(
    private diagramStructureChangesService: DiagramStructureChangesService,
    private diagramLayoutChangesService: DiagramLayoutChangesService,
    private diagramLevelService: DiagramLevelService,
    private diagramViewChangesService: DiagramViewChangesService,
    private store: Store<RouterReducerState<RouterStateUrl>>
  ) {
    thisService = this;
    thisService.store.select(getNodeIdQueryParams).subscribe(id => (thisService.nodeId = id));
  }

  // Add all needed listeners to the diagram
  enableListeners(diagram: go.Diagram): void {
    diagram.addDiagramListener('ChangedSelection', thisService.handleChangedSelection);

    diagram.addDiagramListener(
      'ExternalObjectsDropped',
      thisService.diagramStructureChangesService.createObjects
    );

    diagram.addDiagramListener(
      'SelectionMoved',
      thisService.diagramLayoutChangesService.updatePosition
    );

    diagram.addDiagramListener(
      'SelectionMoved',
      function (event) {
        if (thisService.diagramLevelService.currentLevel.endsWith('map')) {
          thisService.diagramLevelService.relayoutGroups(event);
        }
      }
    );

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {
        const currentLevel = thisService.diagramLevelService.currentLevel;

        // Ensure links are updated in map view after group layout is performed
        if (currentLevel && currentLevel.endsWith('map')) {
          event.diagram.links.each(function(link) {
            link.data = Object.assign({}, link.data, { updateRoute: true });
            link.invalidateRoute();
          });
        }

        if (currentLevel && currentLevel.endsWith('map') && thisService.diagramLevelService.groupLayoutInitial) {
          diagram.findTopLevelGroups().each(function(group) {
            group.invalidateLayout();
          });
          if (diagram.model.nodeDataArray.length !== 0) {
            // Indicate that the initial layout for the groups has been performed
            thisService.diagramLevelService.groupLayoutInitial = false;
            // Reset content alignment to the default after layout has been completed so that diagram can be scrolled
            diagram.contentAlignment = go.Spot.Default;
          }
        }
      }
    );

    // After layout when in system or data view, check for system or data group nodes that are
    //  too large for their groups and update the size of their containing groups
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {
        const currentLevel = thisService.diagramLevelService.currentLevel;

        // Check current level is system or data
        if (currentLevel && [Level.system, Level.data].includes(currentLevel)) {

          const nodesToUpdate = new go.Set<go.Node>();

          event.diagram.nodes.each(function(node: go.Node): void {

            const group = node.containingGroup;

            // Check nodes in expanded containing groups
            if (group && group.isSubGraphExpanded) {
              const containingArea = group.findObject('Group member area');
              const memberBounds = containingArea.getDocumentBounds().copy();

              // Run process to resize containing groups if member is not correctly enclosed
              if (!memberBounds.containsRect(node.getDocumentBounds())) {
                thisService.diagramLayoutChangesService.groupMemberSizeChanged(node as go.Group);
              }
            }
          });
          if (nodesToUpdate.count > 0) {
            thisService.diagramLayoutChangesService.updatePosition({ diagram: event. diagram, subject: nodesToUpdate});
          }
        }
      }
    );

    // After a system or data group is automatically laid out, ensure that links to
    //  any grouped nodes are updated.
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {

        const linksToUpdate = new go.Set();
        event.diagram.nodes.each(function(node: go.Node): void {
          if (node.canLayout() && node.containingGroup && [layers.system, layers.data].includes(node.data.layer)) {
            linksToUpdate.addAll(node.linksConnected);
          }
        });

        linksToUpdate.each(function(link: go.Link) {
          link.data = Object.assign(link.data, {updateRoute: true});
          link.invalidateRoute();
          link.updateRoute();
        });

      }
    );

    // After diagram layout complete, save routes of links that have been calculated
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event: go.DiagramEvent): void {
        const currentLevel = thisService.diagramLevelService.currentLevel;

        if (currentLevel && !currentLevel.endsWith('map') &&
          ![Level.usage, Level.sources, Level.targets].includes(currentLevel)
        ) {
          setTimeout(
            function() {
              thisService.diagramLayoutChangesService.saveCalculatedRoutes(event.diagram);
            },
            0
          );
        }
      }
    );

    diagram.addDiagramListener('LayoutCompleted', initialFitToScreen);

    // Prevent fit to screen after user adds parts to an initially empty diagram
    diagram.addDiagramListener('ExternalObjectsDropped', function(): void {
      diagram.removeDiagramListener('LayoutCompleted', initialFitToScreen);
    });

    // Place lanes to indicate node layers in node usage view
    diagram.addDiagramListener(
      'LayoutCompleted',
      thisService.diagramStructureChangesService.placeNodeUsageLanes
    );

    // If diagram non-empty, fit diagram to screen
    function initialFitToScreen(event: go.DiagramEvent): void {
      // Fit to screen when diagram contains both nodes and links
      if (event.diagram.nodes.count > 0 && event.diagram.links.count > 0) {
        setTimeout(function(): void {
          event.diagram.zoomToFit();
        }, 1);
        // Remove current listener to prevent function running more than once
        event.diagram.removeDiagramListener('LayoutCompleted', initialFitToScreen);
      } else if (event.diagram.nodes.count > 0 && event.diagram.links.count === 0) {
        setTimeout(function(): void {
          if (event.diagram.links.count === 0) {
            event.diagram.zoomToFit();
            event.diagram.removeDiagramListener('LayoutCompleted', initialFitToScreen);
          }
        }, 300);
      }
    }

    // Ensure groups in sources or targets view are laid out and sized correctly.
    // Also apply a blue shadow to the node for which sources/targets are being viewed.
    diagram.addDiagramListener(
      'LayoutCompleted',
      function (event: go.DiagramEvent): void {
        const currentLevel = thisService.diagramLevelService.currentLevel;
        const nodeId = thisService.nodeId;

        if ([Level.sources, Level.targets].includes(currentLevel)) {
          diagram.nodes.each(function(node) {
            if (!node.location.isReal() && node.containingGroup && node.containingGroup.location.isReal()) {
              node.containingGroup.layout.isValidLayout = false;
              node.diagram.layout.isValidLayout = false;
            } else if (node.location.isReal() && node.containingGroup) {
              thisService.diagramLayoutChangesService.groupMemberSizeChanged(node as go.Group);
              if (nodeId === node.data.id) {
                thisService.diagramViewChangesService.setBlueShadowHighlight(node, true);
              }
            }
          });
        }
      }
    );

    diagram.addDiagramListener(
      'LinkRelinked',
      thisService.diagramStructureChangesService.updateLinkConnections
    );

    diagram.addDiagramListener(
      'LinkReshaped',
      function(event: go.DiagramEvent) {
        event.subject = new go.Set([event.subject]);

        thisService.diagramLayoutChangesService.updatePosition(event);
      }
    );

    diagram.addDiagramListener(
      'PartResized',
      thisService.diagramLayoutChangesService.groupAreaChanged
    );

    diagram.addModelChangedListener(thisService.handleModelChange);

    // Listeners to hide button menu on system and data nodes when user clicks outside menu
    diagram.addDiagramListener(
      'ChangedSelection',
      function(event: go.DiagramEvent): void {
        event.diagram.nodes.each(function(node: go.Part): void {
          node.removeAdornment('ButtonMenu');
        });
      }
    );
    diagram.addDiagramListener(
      'LostFocus',
      function(event: go.DiagramEvent): void {
        event.diagram.nodes.each(function(node: go.Part): void {
          node.removeAdornment('ButtonMenu');
        });
      }
    );

    // When viewport changes size, update size/scale of guide
    diagram.addDiagramListener('ViewportBoundsChanged', function(event) {
      let guide;
      diagram.parts.each(function(part) {
        if (part.name === 'Guide') {
          guide = part;
        }
      });

      if (guide) {
        guide.position = diagram.transformViewToDoc(new go.Point(0, 0));
        guide.scale = 1 / diagram.scale;
      }

      const instructions = guide.findObject('instructions');

      // Ensure instructions do not exceed screen space available
      instructions.width = Math.max(100, diagram.viewportBounds.width - 10);
    });

    // Update z order when selection changes to ensure selected nodes are in front
    diagram.addDiagramListener(
      'ChangedSelection',
      function(event: go.DiagramEvent): void {
        thisService.diagramViewChangesService.updateZOrder(event.diagram);
      }
    );

    // On selection change, update visibility of hidden-node warning icon for any node
    //  surrounding a newly selected node
    diagram.addDiagramListener('ChangedSelection', function(event: go.DiagramEvent): void {
      const nodesToUpdate = new go.Set<go.Part>();
      const allNodes = event.diagram.nodes;

      event.diagram.selection.each(function(part: go.Part): void {
        if (part instanceof go.Node) {
          event.diagram.findPartsAt(part.location, true, nodesToUpdate);
        }
      });

      // Remove links and selected nodes from set of nodes to update
      nodesToUpdate.retainAll(allNodes);
      nodesToUpdate.removeAll(event.diagram.selection);

      nodesToUpdate.each(function(node: go.Node): void {node.updateTargetBindings(); });
    });

    // In node usage view, highlight the originating node with a blue shadow.
    // Also, ensure originating node is visible by expanding the chain of containing nodes.
    diagram.addModelChangedListener(function(event: go.ChangedEvent): void {
      if (event.modelChange === 'nodeDataArray') {
        const currentLevel = thisService.diagramLevelService.currentLevel;
        const nodeId = thisService.nodeId;

        if (currentLevel && currentLevel === Level.usage && nodeId) {
          const usageNode = diagram.findNodeForKey(nodeId);
          if (usageNode) {
            thisService.diagramViewChangesService.setBlueShadowHighlight(usageNode, true);

            // Get nested containing nodes
            const containingNodes = [];
            let containingNode = usageNode.containingGroup;
            while (containingNode) {
              containingNodes.splice(0, 0, containingNode);
              containingNode = containingNode.containingGroup;
            }

            // Expand all containing nodes
            containingNodes.forEach(function(node: go.Group, index: number): void {
              // Add delay to ensure each group expanded before expanding the next
              setTimeout(function() {
                diagram.model.setDataProperty(node.data, 'middleExpanded', true);
                diagram.model.setDataProperty(node.data, 'bottomExpanded', bottomOptions.group);
                thisService.diagramLayoutChangesService.nodeExpandChanged(node);
              }, 150 * (index + 1));
            });
          }
        }
      }
    });

    // Update guide
    diagram.addModelChangedListener(function(event: go.ChangedEvent): void {
      thisService.diagramStructureChangesService.updateGuide(diagram);
    });
  }

  handleChangedSelection(event: go.DiagramEvent): void {
    const parts = event.diagram.selection.toArray();
    thisService.nodeSelectedSource.next(parts);
  }

  handleModelChange(event: go.ChangedEvent): void {
    if (event.isTransactionFinished) {
      thisService.modelChangedSource.next(event);
    }
  }
}
