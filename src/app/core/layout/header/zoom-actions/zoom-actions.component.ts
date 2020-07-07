import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Level } from '@app/architecture/services/diagram-level.service';
import { SetViewLevel } from '@app/architecture/store/actions/view.actions';
import { State as ViewState } from '@app/architecture/store/reducers/architecture.reducer';
import { Subscription } from 'rxjs';
import { getViewLevel } from '@app/architecture/store/selectors/view.selector';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { getFilterLevelQueryParams } from '@app/core/store/selectors/route.selectors';

interface Layers {
  level: string;
  name: string;
}

@Component({
  selector: 'app-zoom-actions',
  templateUrl: './zoom-actions.component.html',
  styleUrls: ['./zoom-actions.component.scss']
})
export class ZoomActionsComponent implements OnInit, OnDestroy {
  public selected: Level;
  public viewLevel: Level;

  private filterLevel: Level;
  private viewLevelSubscription: Subscription;

  layers: Layers[] = [
    { level: Level.system, name: 'system' },
    { level: Level.systemMap, name: 'system map' },
    { level: Level.data, name: 'data' },
    { level: Level.dataMap, name: 'data map' },
    { level: Level.dimension, name: 'dimension' },
    { level: Level.dimensionMap, name: 'dimension map' },
    { level: Level.reportingConcept, name: 'reporting concept' },
    { level: Level.usage, name: 'usage analysis' },
    { level: Level.sources, name: 'sources' },
    { level: Level.targets, name: 'targets' }
  ];

  constructor(private store: Store<ViewState>) {}

  ngOnInit() {
    this.store.select(getFilterLevelQueryParams).subscribe(filterLevel => (this.filterLevel = filterLevel));
    this.viewLevelSubscription = this.store.pipe(select(getViewLevel)).subscribe(level => {
      this.viewLevel = level;
      if (level) {
        this.selected = level;
      }
    });
  }

  ngOnDestroy(): void {
    this.viewLevelSubscription.unsubscribe();
  }

  onViewLevelSelected(level: Level) {
    if (level) {
      if (this.filterLevel !== level) {
        this.store.dispatch(new UpdateQueryParams({ filterLevel: level, id: null, parentName: null }));
      }
    }
    this.store.dispatch(new SetViewLevel(level));
  }

  getMapLevel(level: Level): boolean {
    if (level.endsWith('map') || level === Level.usage) {
      return true;
    }
  }
}
