import * as go from 'gojs';
import {Injectable} from '@angular/core';
import {DiagramChangesService} from './diagram-changes.service';
import {DiagramLevelService} from './diagram-level.service';
import { Subject } from 'rxjs/Subject';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramListenersService {

  private nodeSelectedSource = new Subject();
  public nodeSelected$ = this.nodeSelectedSource.asObservable();

  private modelChangedSource = new Subject();
  public modelChanged$ = this.modelChangedSource.asObservable();

  constructor(
    public diagramChangesService: DiagramChangesService,
    public diagramLevelService: DiagramLevelService
  ) {
  }

  enableListeners(diagram: go.Diagram) {

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

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener('LayoutCompleted', function() {

      if (this.diagramLevelService.mapView && this.diagramLevelService.groupLayoutInitial) {
        diagram.findTopLevelGroups().each(function(group) {group.invalidateLayout(); });
        if (diagram.model.nodeDataArray.length !== 0) {
          // Indicate that the initial layout for the groups has been performed
          this.diagramLevelService.groupLayoutInitial = false;
          // Reset content alignment to the default after layout has been completed so that diagram can be scrolled
          diagram.contentAlignment = go.Spot.Default;
        }
      }
    }.bind(this));

    diagram.addDiagramListener(
      'LinkRelinked',
       this.diagramChangesService.updateLinkConnections.bind(this.diagramChangesService)
    );

    diagram.addDiagramListener(
      'LinkReshaped',
      function(event: any) {
        event.subject = new go.Set([event.subject]);

        if (this.standardDisplay) {
          this.updatePosition(event);
        }
      }.bind(this.diagramChangesService)
    );

    diagram.addModelChangedListener(this.handleModelChange.bind(this));

  }

  handleChangedSelection(event: go.DiagramEvent) {
    const node = event.diagram.selection.first();
    this.nodeSelectedSource.next(node);
  }

  handleModelChange(event: go.ChangedEvent) {
    if (event.isTransactionFinished) {
      console.log('Nodes:', event.model.nodeDataArray);
      console.log('Links:', (event.model as go.GraphLinksModel).linkDataArray);
      this.modelChangedSource.next(event);
    }
  }
}
