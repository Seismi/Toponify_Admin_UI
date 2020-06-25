import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ScopeDetails } from '@app/scope/store/models/scope.model';
import { Level } from '@app/architecture/services/diagram-level.service';
import { Store } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '@app/core/store';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';

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
  @Input() dependenciesView: boolean;
  @Input() filterLevel: string;
  @Input() selectedLayout: ScopeDetails;
  @Input() layouts: ScopeDetails[];

  constructor(private routerStore: Store<RouterReducerState<RouterStateUrl>>) { }

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

}
