import * as go from 'gojs';
import { Injectable } from '@angular/core';
import { DiagramChangesService } from './diagram-changes.service';
import {DiagramLevelService, Level} from './diagram-level.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import {getFilterLevelQueryParams, getNodeIdQueryParams} from '@app/core/store/selectors/route.selectors';
import { take } from 'rxjs/operators';
import {layers, middleOptions} from '@app/architecture/store/models/node.model';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramListenersService {
  private nodeSelectedSource = new Subject();
  public partsSelected$ = this.nodeSelectedSource.asObservable();

  private modelChangedSource = new Subject();
  public modelChanged$ = this.modelChangedSource.asObservable();

  private currentLevel: Level;
  private nodeId: string;

  constructor(
    public diagramChangesService: DiagramChangesService,
    public diagramLevelService: DiagramLevelService,
    private store: Store<RouterReducerState<RouterStateUrl>>
  ) {
    this.store.select(getFilterLevelQueryParams).subscribe(level => (this.currentLevel = level));
    this.store.select(getNodeIdQueryParams).subscribe(id => (this.nodeId = id));
  }

  // Add all needed listeners to the diagram
  enableListeners(diagram: go.Diagram): void {
    diagram.addDiagramListener('ChangedSelection', this.handleChangedSelection.bind(this));

    diagram.addDiagramListener(
      'ExternalObjectsDropped',
      this.diagramChangesService.createObjects.bind(this.diagramChangesService)
    );

    diagram.addDiagramListener(
      'SelectionMoved',
      this.diagramChangesService.updatePosition.bind(this.diagramChangesService)
    );

    // Update brush direction for links connected to moved nodes
    diagram.addDiagramListener('SelectionMoved', function(event) {
      event.diagram.startTransaction('Recalculate link colours');
      const linksToUpdate = new go.Set();

      event.subject.each(function(part) {
        if (part instanceof go.Node) {
          linksToUpdate.addAll(part.linksConnected);
        }
      });

      linksToUpdate.each(function(link: go.Link) {
        link.updateTargetBindings('impactedByWorkPackages');
      });
      event.diagram.commitTransaction('Recalculate link colours');
    });

    diagram.addDiagramListener('SelectionMoved', this.diagramLevelService.relayoutGroups);

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {
        const currentLevel = this.currentLevel;

        // Ensure links are updated in map view after group layout is performed
        if (currentLevel && currentLevel.endsWith('map')) {
          event.diagram.links.each(function(link) {
            link.data = Object.assign({}, link.data, { updateRoute: true });
            link.invalidateRoute();
          });
        }

        if (currentLevel && currentLevel.endsWith('map') && this.diagramLevelService.groupLayoutInitial) {
          diagram.findTopLevelGroups().each(function(group) {
            group.invalidateLayout();
          });
          if (diagram.model.nodeDataArray.length !== 0) {
            // Indicate that the initial layout for the groups has been performed
            this.diagramLevelService.groupLayoutInitial = false;
            // Reset content alignment to the default after layout has been completed so that diagram can be scrolled
            diagram.contentAlignment = go.Spot.Default;
          }
        }
      }.bind(this)
    );

    // After layout when in system or data view, check for system or data group nodes that are
    //  too large for their groups and update the size of their containing groups
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {
        const currentLevel = this.currentLevel;

        // Check current level is system or data
        if (currentLevel && [Level.system, Level.data].includes(currentLevel)) {
          event.diagram.nodes.each(function(node: go.Node): void {

            const group = node.containingGroup;

            // Check nodes in expanded containing groups
            if (group && group.isSubGraphExpanded) {
              const containingArea = group.findObject('Group member area');
              const memberBounds = containingArea.getDocumentBounds().copy();
              const nodeBounds = node.getDocumentBounds();

              // Reposition members that lie outside of the containing group's bounds
              if (memberBounds.top > nodeBounds.top
                || !memberBounds.intersectsRect(nodeBounds)) {

                const newLocation = new go.Point();

                // Centre align member
                newLocation.x = memberBounds.centerX;

                // Initialise new member location to be near the top of the member
                //  area, in case group has no other members
                newLocation.y = memberBounds.top + 12;

                // Place member underneath all correctly positioned members,
                //  separated by a small gap
                group.findSubGraphParts().each(function(part: go.Part) {

                  const partBounds = part.getDocumentBounds();

                  if (part instanceof go.Node
                    && memberBounds.containsRect(partBounds)
                  ) {
                    newLocation.y = Math.max(newLocation.y, partBounds.bottom + 12);
                  }
                });

                node.move(newLocation, true);
                node.ensureBounds();
              }

              // Run process to resize containing groups if member is not correctly enclosed
              if (!memberBounds.containsRect(nodeBounds)) {
                this.diagramChangesService.groupMemberSizeChanged(node);
              }
            }
          }.bind(this));
        }
      }.bind(this)
    );

    // After diagram layout is completed, ensure that no nodes overlap
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event: go.DiagramEvent): void {

        const currentLevel = this.currentLevel;

        if (currentLevel && !currentLevel.endsWith('map') && currentLevel !== Level.usage) {

          // Check each node for overlap
          event.diagram.nodes.each(function(node: go.Node): void {
            if (!this.diagramChangesService.isUnoccupied(node.actualBounds, node)) {
              const rectangle = node.actualBounds.copy();

              // If node is found to overlap, look for unoccupied area to move node to
              do {
                // Move search area down until a space is found
                rectangle.offset(0, 10);
              } while (!this.diagramChangesService.isUnoccupied(rectangle, node));

              // Move node to unoccupied area
              node.moveTo(rectangle.left, rectangle.top);
              node.ensureBounds();

              // Reroute any links connected to the node
              node.findLinksConnected().each(function(link: go.Link): void {
                link.data.updateRoute = true;
                link.updateRoute();
              });
            }
          }.bind(this));
        }
      }.bind(this)
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

      }.bind(this)
    );

    diagram.addDiagramListener('LayoutCompleted', initialFitToScreen);

    // Prevent fit to screen after user adds parts to an initially empty diagram
    diagram.addDiagramListener('ExternalObjectsDropped', function(): void {
      diagram.removeDiagramListener('LayoutCompleted', initialFitToScreen);
    });

    // Place lanes to indicate node layers in node usage view
    diagram.addDiagramListener(
      'LayoutCompleted',
      this.diagramChangesService.placeNodeUsageLanes.bind(this.diagramChangesService)
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

    diagram.addDiagramListener(
      'LinkRelinked',
      this.diagramChangesService.updateLinkConnections.bind(this.diagramChangesService)
    );

    diagram.addDiagramListener(
      'LinkReshaped',
      function(event: go.DiagramEvent) {
        event.subject = new go.Set([event.subject]);

        this.updatePosition(event);
      }.bind(this.diagramChangesService)
    );

    diagram.addDiagramListener(
      'PartResized',
      this.diagramChangesService.groupAreaChanged.bind(this.diagramChangesService)
    );

    diagram.addModelChangedListener(this.handleModelChange.bind(this));

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

    // In node usage view, highlight the originating node with a blue shadow.
    // Also, ensure originating node is visible by expanding the chain of containing nodes.
    diagram.addModelChangedListener(function(event: go.ChangedEvent): void {
      if (event.modelChange === 'nodeDataArray') {
        const currentLevel = this.currentLevel;
        const nodeId = this.nodeId;

        if (currentLevel && currentLevel === Level.usage && nodeId) {
          const usageNode = diagram.findNodeForKey(nodeId);
          if (usageNode) {
            this.diagramChangesService.setBlueShadowHighlight(usageNode, true);

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
                diagram.model.setDataProperty(node.data, 'bottomExpanded', false);
                diagram.model.setDataProperty(node.data, 'middleExpanded', middleOptions.group);
                this.diagramChangesService.nodeExpandChanged(node);
              }.bind(this), 150 * (index + 1));
            }.bind(this));
          }
        }
      }
    }.bind(this));

    // Update guide
    diagram.addModelChangedListener(function(event: go.ChangedEvent): void {
      this.diagramChangesService.updateGuide(diagram);
    }.bind(this));
  }

  handleChangedSelection(event: go.DiagramEvent): void {
    const parts = event.diagram.selection.toArray();
    this.nodeSelectedSource.next(parts);
  }

  handleModelChange(event: go.ChangedEvent): void {
    if (event.isTransactionFinished) {
      this.modelChangedSource.next(event);
    }
  }
}
