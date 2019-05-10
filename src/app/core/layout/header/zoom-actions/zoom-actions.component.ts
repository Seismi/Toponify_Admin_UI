import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { FilterService } from '@app/version/services/filter.service';
import { Level } from '@app/version/services/diagram.service';
import { SetZoomLevel, SetViewLevel } from '@app/version/store/actions/view.actions';
import * as fromVersion from '../../../../version/store/reducers';
import { getViewLevel, getZoomLevel } from '@app/architecture/store/selectors/view.selector';

export const viewLevelMapping = {
  [1]: Level.system,
  [2]: Level.model,
  [3]: Level.dimension,
  [4]: Level.element,
  [5]: Level.attribute
};

@Component({
  selector: 'app-zoom-actions',
  templateUrl: './zoom-actions.component.html',
  styleUrls: ['./zoom-actions.component.scss'],
  providers: [FilterService]
})
export class ZoomActionsComponent implements OnInit, OnDestroy {

  public zoomLevel: number;
  public zoomLevel$: Observable<number>;
  public viewLevel$: Observable<number>;

  zoomLevelSubscription: Subscription;
  viewLevelSubscription: Subscription;

  @Input() attributesView = false;

  constructor(private store: Store<fromVersion.State>, public filterService: FilterService) {}

  ngOnInit() {
    this.zoomLevel$ = this.store.pipe(select(getZoomLevel));
    this.viewLevel$ = this.store.pipe(select(getViewLevel));
    this.zoomLevelSubscription = this.zoomLevel$.subscribe(zoom => (this.zoomLevel = zoom));
    this.viewLevelSubscription = this.viewLevel$.subscribe(level => {});
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.viewLevelSubscription.unsubscribe();
    this.zoomLevelSubscription.unsubscribe();
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

  viewLevelSelected(level: any) {
    if (viewLevelMapping[level]) {
      if (this.filterService.getFilter().filterLevel !== viewLevelMapping[level]) {
        this.filterService.setFilter({filterLevel: viewLevelMapping[level]});
      }
    }
    
    //FIXME: table and diagram logic should be improved
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
