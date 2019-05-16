import * as go from 'gojs';
import {Injectable} from '@angular/core';
import {FilterService} from './filter.service';
import {DiagramChangesService} from './diagram-changes.service';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramListenersService {

  constructor(
    public filterService: FilterService,
    public diagramChangesService: DiagramChangesService
  ) {
  }

  enableListeners(diagram: go.Diagram) {

    diagram.addDiagramListener(
      'ChangedSelection',
      this.handleChangedSelection.bind(this)
    );

    diagram.addDiagramListener(
      'ExternalObjectsDropped',
      this.diagramChangesService.createObjects
    );

    diagram.addDiagramListener(
      'SelectionMoved',
      this.diagramChangesService.updatePosition
    );

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener('LayoutCompleted', function() {

      if (this.mapView && this.diagramService.groupLayoutInitial) {
        diagram.findTopLevelGroups().each(function(group) {group.invalidateLayout(); });
        if (diagram.model.nodeDataArray.length !== 0) {
          // Indicate that the initial layout for the groups has been performed
          this.diagramService.groupLayoutInitial = false;
          // Reset content alignment to the default after layout has been completed so that diagram can be scrolled
          diagram.contentAlignment = go.Spot.Default;
        }
      }

    }.bind(this));

    diagram.addDiagramListener(
      'LinkRelinked',
       this.diagramChangesService.updateLinkConnections
    );

    diagram.addDiagramListener(
      'LinkReshaped',
      function(event: any) {
        event.subject = new go.Set([event.subject]);

        if (this.diagramService.standardDisplay) {
          this.diagramService.updatePosition(event);
        }
      }.bind(this)
    );

    diagram.addModelChangedListener(this.handleModelChange.bind(this));

  }

  handleChangedSelection(event: any) {
    const node = event.diagram.selection.first();
    this.nodeSelected.emit(node);
  }

  handleModelChange(event: any) {
    if (event.isTransactionFinished) {
      console.log('Nodes:', event.diagram.model.nodeDataArray);
      console.log('Links:', (event.diagram.model as go.GraphLinksModel).linkDataArray);
      event.model.modelChanged.emit(event);
    }
  }
}
