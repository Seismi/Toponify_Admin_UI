import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Level } from '../../../../architecture/services/diagram-level.service';
import { SetViewLevel } from '../../../../architecture/store/actions/view.actions';
import { State as ViewState } from '../../../../architecture/store/reducers/architecture.reducer';
import { FilterService } from '@app/architecture/services/filter.service';
import { Observable, Subscription } from 'rxjs';
import { getViewLevel } from '@app/architecture/store/selectors/view.selector';

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
    public filterService: FilterService
  ) {}

  ngOnInit() { 
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
      if (this.filterService.getFilter().filterLevel !== viewLevelMapping[level]) {
        this.filterService.addFilter({filterLevel: viewLevelMapping[level]}, 'id');
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