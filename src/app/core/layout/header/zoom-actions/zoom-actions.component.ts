import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Level } from '@app/architecture/services/diagram-level.service';
import { SetViewLevel } from '@app/architecture/store/actions/view.actions';
import { State as ViewState } from '@app/architecture/store/reducers/architecture.reducer';
import { FilterService } from '@app/architecture/services/filter.service';
import { Observable, Subscription } from 'rxjs';
import { getViewLevel } from '@app/architecture/store/selectors/view.selector';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';

export const viewLevelMapping = {
  [1]: Level.system,
  [2]: Level.dataSet,
  [3]: Level.dimension,
  [4]: Level.reportingConcept
};

@Component({
  selector: 'app-zoom-actions',
  templateUrl: './zoom-actions.component.html',
  styleUrls: ['./zoom-actions.component.scss'],
  providers: [FilterService]
})
export class ZoomActionsComponent implements OnInit, OnDestroy {

  selected: string;
  filterLevel: number;

  public viewLevel: number;
  public viewLevel$: Observable<number>;

  viewLevelSubscription: Subscription;

  layers = [
    { level: 1, name: 'system' },
    { level: 2, name: 'data set' },
    { level: 3, name: 'dimension' },
    { level: 4, name: 'reporting concept' }
  ]

  constructor(
    private store: Store<ViewState>,
  ) {}

  ngOnInit() {
    this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => this.filterLevel = filterLevel);
    this.viewLevel$ = this.store.pipe(select(getViewLevel));
    this.viewLevelSubscription = this.viewLevel$.subscribe(level => {
      this.viewLevel = level;
      if (level) {
        this.selected = viewLevelMapping[level];
      }
    });
  }

  ngOnDestroy(): void {
    this.viewLevelSubscription.unsubscribe();
  }

  onViewLevelSelected(level: any) {
    if (viewLevelMapping[level]) {
      if (this.filterLevel !== viewLevelMapping[level]) {
        this.store.dispatch(new UpdateQueryParams({filterLevel: viewLevelMapping[level], id: null, parentName: null}));
        // this.filterService.addFilter({filterLevel: viewLevelMapping[level]}, ['id', 'parentName']);
      }
    }
    this.store.dispatch(new SetViewLevel(level));
  }

  @Output()
  zoomIn = new EventEmitter();

  @Output()
  zoomOut = new EventEmitter();

  onZoomIn() {
    this.zoomIn.emit();
  }

  onZoomOut() {
    this.zoomOut.emit();
  }

}
