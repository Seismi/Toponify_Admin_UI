import * as go from 'gojs';
import {Injectable} from '@angular/core';
import {DiagramChangesService} from './diagram-changes.service';
import {DiagramLevelService, Level} from './diagram-level.service';
import { Subject } from 'rxjs/Subject';
import {FilterService} from '@app/architecture/services/filter.service';

const $ = go.GraphObject.make;

@Injectable()
export class DiagramListenersService {

  private nodeSelectedSource = new Subject();
  public nodeSelected$ = this.nodeSelectedSource.asObservable();

  private modelChangedSource = new Subject();
  public modelChanged$ = this.modelChangedSource.asObservable();

  constructor(
    public diagramChangesService: DiagramChangesService,
    public diagramLevelService: DiagramLevelService,
    public filterService: FilterService
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

    diagram.addDiagramListener('SelectionMoved', this.diagramLevelService.relayoutGroups);

    // After diagram layout, redo group layouts in map view to correct link paths
    diagram.addDiagramListener('LayoutCompleted', function(event) {

      const currentLevel = this.filterService.getFilter().filterLevel;

      // Ensure links are updated in map view after group layout is performed
      if (currentLevel === Level.map) {
        event.diagram.links.each(function(link) {
          event.diagram.model.setDataProperty(link.data, 'updateRoute', true);
          link.invalidateRoute(true);
        });
      }

      if (currentLevel === Level.map && this.diagramLevelService.groupLayoutInitial) {
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
