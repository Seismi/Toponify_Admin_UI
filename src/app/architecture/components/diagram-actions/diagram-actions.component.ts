import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { Level } from '@app/architecture/services/diagram-level.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { defaultLayoutId } from '@app/layout/store/models/layout.model';
import { DiagramChangesService } from '@app/architecture/services/diagram-changes.service';

@Component({
  selector: 'smi-diagram-actions',
  templateUrl: './diagram-actions.component.html',
  styleUrls: ['./diagram-actions.component.scss']
})
export class DiagramActionsComponent {
  public Level = Level;
  @Input() grid: boolean;
  @Input() allowMove: boolean;
  @Input() allowSave = false;
  @Input() allowSaveAs = false;
  @Input() filterLevel: string;
  @Input() selectedLayout: ScopeDetails;
  @Input() layouts: ScopeDetails[];
  @Input() selectedPart;
  @Input() clickedOnLink: boolean;
  @Input() selectedNode: NodeDetail;
  @Input() groupName: string | null;
  @Input() scope: ScopeDetails;

  constructor(
    public diagramChangeService: DiagramChangesService,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>
  ) { }

  @Output() zoomIn = new EventEmitter<void>();
  @Output() zoomOut = new EventEmitter<void>();
  @Output() showGrid = new EventEmitter<void>();
  @Output() zoomToFit = new EventEmitter<void>();
  @Output() downloadImage = new EventEmitter<void>();
  @Output() editLayout = new EventEmitter<void>();
  @Output() saveLayout = new EventEmitter<void>();
  @Output() saveAsLayout = new EventEmitter<void>();
  @Output() layoutSettings = new EventEmitter<void>();
  @Output() selectLayout = new EventEmitter<any>();
  @Output() exitDependenciesView = new EventEmitter<void>();
  @Output() addLayout = new EventEmitter<void>();

  exitUsageView(): void {
    this.routerStore.dispatch(new UpdateQueryParams({ filterLevel: Level.system, id: null }));
  }

  getMapView(): boolean {
    return [Level.systemMap, Level.dataMap, Level.dimensionMap].includes(this.filterLevel as Level) ? true : false;
  }

  exitMapView(): void {
    this.routerStore.dispatch(
      new UpdateQueryParams({
        filterLevel: this.filterLevel.replace(' map', ''),
        id: null
      })
    );
  }

  exitSourceOrTargetView(): void {
    this.routerStore.dispatch(new UpdateQueryParams({ filterLevel: Level.data, id: null }));
  }

  getWarning(): string {
    const message1 = 'Warning - Create a new layout to save positions.';
    const message2 = 'Warning - Unsaved changes to positions.';
    return this.selectedLayout && this.selectedLayout.id === defaultLayoutId ? message1 : this.allowSave ? message2 : null;
  }

  displayingGroupName(): void {
    this.routerStore.dispatch(
      new UpdateQueryParams({
        filterLevel: this.filterLevel as Level,
        id: null,
        groupName: null
      })
    );
  }
}
