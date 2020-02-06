import * as go from 'gojs';
import { Injectable } from '@angular/core';
import { DiagramChangesService } from './diagram-changes.service';
import { DiagramLevelService } from './diagram-level.service';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';
import { take } from 'rxjs/operators';
import {layers} from '@app/architecture/store/models/node.model';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramListenersService {
  private nodeSelectedSource = new Subject();
  public partsSelected$ = this.nodeSelectedSource.asObservable();

  private modelChangedSource = new Subject();
  public modelChanged$ = this.modelChangedSource.asObservable();

  constructor(
    public diagramChangesService: DiagramChangesService,
    public diagramLevelService: DiagramLevelService,
    private store: Store<RouterReducerState<RouterStateUrl>>
  ) {}

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
        this.store
          .select(getFilterLevelQueryParams)
          .pipe(take(1))
          .subscribe(currentLevel => {
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
          });
      }.bind(this)
    );

    // After a system group is automatically laid out, ensure that links to
    //  any grouped nodes are updated.
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {

        const linksToUpdate = new go.Set();
        event.diagram.nodes.each(function(node: go.Node): void {
          if (node.canLayout() && node.containingGroup && node.category === layers.system) {
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
      function(event: any) {
        event.subject = new go.Set([event.subject]);

        this.updatePosition(event);
      }.bind(this.diagramChangesService)
    );

    diagram.addDiagramListener(
      'PartResized',
      this.diagramChangesService.groupAreaChanged.bind(this.diagramChangesService)
    );

    diagram.addModelChangedListener(this.handleModelChange.bind(this));

    // Listeners to hide button menu on system nodes when user clicks outside menu
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
