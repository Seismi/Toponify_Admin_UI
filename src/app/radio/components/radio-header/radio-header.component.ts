import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterStateUrl } from '@app/core/store';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { getQueryParams } from '@app/core/store/selectors/route.selectors';
import {
  CreateRadioViewSuccess,
  DeleteRadioView,
  GetRadioView,
  GetRadioViews,
  RadioFilter,
  SetRadioAnalysisFilter,
  SetRadioViewAsFavourite,
  UnsetRadioViewAsFavourite,
  UpdateRadioView
} from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioEntities, getRadioFilter, getRadioViews } from '@app/radio/store/selectors/radio.selector';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { RadioViewNameDialogComponent } from '../radio-view-name-dialog/radio-view-name-dialog.component';

enum TableStyles {
  SIMPLE = 'Simple Table',
  MANAGEMENT = 'Management Table'
}

@Component({
  selector: 'smi-radio-header',
  templateUrl: './radio-header.component.html',
  styleUrls: ['./radio-header.component.scss']
})
export class RadioHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public tableStyles = TableStyles;
  public selectedTableStyle: BehaviorSubject<TableStyles> = new BehaviorSubject(TableStyles.SIMPLE);
  public activeFilters: any = {};
  public radioViews = [];
  public selectedRadioView = null;
  public radios = [];
  public tableStyleOptions = [
    {
      value: TableStyles.SIMPLE,
      name: 'Simple table style'
    },
    {
      value: TableStyles.MANAGEMENT,
      name: 'Management table style'
    }
  ];

  @Output() filter = new EventEmitter<void>();

  constructor(
    public dialog: MatDialog,
    private store: Store<RadioState>,
    private routerStore: Store<RouterReducerState<RouterStateUrl>>
  ) {}

  get selectedRadioViewId(): string | null {
    return this.selectedRadioView ? this.selectedRadioView.id : null;
  }

  get hasActiveFilters(): boolean {
    return !!this.activeFilters;
  }

  ngOnInit() {
    this.store.dispatch(new GetRadioViews());
    this.subscriptions.push(
      this.store.pipe(select(getRadioFilter)).subscribe(filters => {
        this.activeFilters = filters;
        if (filters && filters.tableStyle) {
          this.selectedTableStyle.next(filters.tableStyle);
        } else {
          this.selectedTableStyle.next(TableStyles.SIMPLE);
        }
      })
    );

    this.subscriptions.push(
      this.selectedTableStyle.pipe(distinctUntilChanged(isEqual)).subscribe(tableStyle => {
        if (TableStyles.SIMPLE === tableStyle) {
          this.store.dispatch(new SetRadioAnalysisFilter(null));
          this.store.dispatch(new RadioFilter(this.getFilteredActiveFilters()));
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getRadioViews)).subscribe(radioViews => (this.radioViews = radioViews))
    );

    this.subscriptions.push(this.store.pipe(select(getRadioEntities)).subscribe(radios => (this.radios = radios)));

    this.subscriptions.push(
      combineLatest(
        this.store.pipe(select(getRadioViews)),
        this.routerStore.pipe(
          select(getQueryParams),
          map(params => params.radioViewId)
        )
      )
        .pipe(
          map(([radioViews, radioViewId]) => {
            return radioViews.find(radioView => radioView.id === radioViewId);
          }),
          distinctUntilChanged(isEqual)
        )
        .subscribe(selectedRadioView => {
          this.selectedRadioView = selectedRadioView;
          if (selectedRadioView) {
            this.store.dispatch(new GetRadioView(selectedRadioView.id));
          } else {
            this.store.dispatch(new RadioFilter(null));
            this.store.dispatch(new SetRadioAnalysisFilter(null));
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onUpdateRadioView(): void {
    this.store.dispatch(
      new UpdateRadioView({
        radioViewId: this.selectedRadioView.id,
        radioViewData: {
          ...this.selectedRadioView,
          type: this.activeFilters.tableStyle,
          filterSet: this.getFilteredActiveFilters()
        }
      })
    );
  }

  onRemoveFavourite(): void {
    this.store.dispatch(new UnsetRadioViewAsFavourite(this.selectedRadioView.id));
  }

  onAddFavourite(): void {
    this.store.dispatch(new SetRadioViewAsFavourite(this.selectedRadioView.id));
  }

  onRadioViewReset(): void {
    this.routerStore.dispatch(new UpdateQueryParams({ radioViewId: null }));
  }

  onRadioViewDelete(): void {
    this.store.dispatch(new DeleteRadioView(this.selectedRadioViewId));
    this.routerStore.dispatch(new UpdateQueryParams({ radioViewId: null }));
  }

  onRadioViewSelect(radioView: any): void {
    this.routerStore.dispatch(new UpdateQueryParams({ radioViewId: radioView.id }));
  }

  onRadioTableStyleSelect(tableStyle: TableStyles): void {
    this.store.dispatch(
      new RadioFilter({
        ...this.activeFilters,
        tableStyle: tableStyle
      })
    );
  }

  getFilteredActiveFilters() {
    if (!this.activeFilters) {
      return null;
    }
    const { frequencyRange, severityRange, ...filtered } = this.activeFilters;
    return filtered;
  }

  onCreateRadioView(): void {
    this.dialog
      .open(RadioViewNameDialogComponent, {
        disableClose: false,
        minWidth: '500px',
        data: {}
      })
      .beforeClosed()
      .subscribe(action => {
        if (action instanceof CreateRadioViewSuccess) {
          this.routerStore.dispatch(new UpdateQueryParams({ radioViewId: action.payload.id }));
        }
      });
  }

  onFilter(): void {
    this.filter.emit();
  }
}
