import * as go from 'gojs';
import { Injectable } from '@angular/core';
import { DiagramChangesService } from './diagram-changes.service';
import { DiagramLevelService, Level } from './diagram-level.service';
import { Subject } from 'rxjs/Subject';
import { FilterService } from '@app/architecture/services/filter.service';

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
    public filterService: FilterService
  ) {}

  // Add all needed listeners to the diagram
  enableListeners(diagram: go.Diagram): void {
    diagram.addDiagramListener(
      'ChangedSelection',
      this.handleChangedSelection.bind(this)
    );

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

    diagram.addDiagramListener(
      'SelectionMoved',
      this.diagramLevelService.relayoutGroups
    );

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener(
      'LayoutCompleted',
      function(event) {
        const currentLevel = this.filterService.getFilter().filterLevel;

        // Ensure links are updated in map view after group layout is performed
        if (currentLevel === Level.map) {
          event.diagram.links.each(function(link) {
            link.data = Object.assign({}, link.data, {updateRoute: true});
            link.invalidateRoute();
          });
        }

        if (
          currentLevel === Level.map &&
          this.diagramLevelService.groupLayoutInitial
        ) {
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

    diagram.addDiagramListener(
      'LinkRelinked',
      this.diagramChangesService.updateLinkConnections.bind(
        this.diagramChangesService
      )
    );

    diagram.addDiagramListener(
      'LinkReshaped',
      function(event: any) {
        event.subject = new go.Set([event.subject]);

        this.updatePosition(event);
      }.bind(this.diagramChangesService)
    );

    diagram.addModelChangedListener(this.handleModelChange.bind(this));
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
