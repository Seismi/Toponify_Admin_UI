import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Level } from '../../../../architecture/services/diagram-level.service';
import { SetZoomLevel, SetViewLevel } from '../../../../architecture/store/actions/view.actions';
import { State as ViewState } from '../../../../architecture/store/reducers/view.reducer';
import { getViewLevel, getZoomLevel } from '@app/architecture/store/selectors/view.selector';
import { FilterService } from '@app/architecture/services/filter.service';

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

  public zoomLevel: number;
  public viewLevel: number;
  public zoomLevel$: Observable<number>;
  public viewLevel$: Observable<number>;

  zoomLevelSubscription: Subscription;
  viewLevelSubscription: Subscription;

  @Input() attributesView = false;

  @Output()
  zoomIn = new EventEmitter();

  @Output()
  zoomOut = new EventEmitter();

  constructor(private store: Store<ViewState>, public filterService: FilterService) {}

  ngOnInit() {
    this.zoomLevel$ = this.store.pipe(select(getZoomLevel));
    this.viewLevel$ = this.store.pipe(select(getViewLevel));
    this.zoomLevelSubscription = this.zoomLevel$.subscribe(zoom => (this.zoomLevel = zoom));
    this.viewLevelSubscription = this.viewLevel$.subscribe(level => (this.viewLevel = level));
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.viewLevelSubscription.unsubscribe();
    this.zoomLevelSubscription.unsubscribe();
  }

  onZoomIn() {
    this.zoomIn.emit();
  }

  onZoomOut() {
    this.zoomOut.emit();
  }

  viewLevelSelected(level: any) {
    if (viewLevelMapping[level]) {
      if (this.filterService.getFilter().filterLevel !== viewLevelMapping[level]) {
        this.filterService.setFilter({filterLevel: viewLevelMapping[level]});
      }
    }
    // FIXME: table and diagram logic should be improved
    this.store.dispatch(new SetViewLevel(level));
  }

  zoomLevelSelected(level: any) {
    if (viewLevelMapping[level]) {
      if (this.filterService.getFilter().filterLevel !== viewLevelMapping[level]) {
        this.filterService.setFilter({filterLevel: viewLevelMapping[level]});
      }
    }
    this.store.dispatch(new SetZoomLevel(level));
  }
}
