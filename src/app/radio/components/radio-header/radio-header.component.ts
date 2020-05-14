import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterStateUrl } from '@app/core/store';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { getQueryParams } from '@app/core/store/selectors/route.selectors';
import {
  DeleteRadioView,
  GetRadioViews,
  GetRadioView,
  RadioFilter,
  UpdateRadioView,
  CreateRadioViewSuccess,
  SetRadioViewAsFavourite,
  UnsetRadioViewAsFavourite
} from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioFilter, getRadioViews, getRadioEntities } from '@app/radio/store/selectors/radio.selector';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { combineLatest, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { RadioViewNameDialogComponent } from '../radio-view-name-dialog/radio-view-name-dialog.component';

@Component({
  selector: 'smi-radio-header',
  templateUrl: './radio-header.component.html',
  styleUrls: ['./radio-header.component.scss']
})
export class RadioHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public activeFilters = null;
  public radioViews = [];
  public selectedRadioView = null;
  public radios = [];

  @Input() status: string;
  @Output() filter = new EventEmitter<void>();
  @Output() resetFilter = new EventEmitter<void>();

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

  get radioRiskMatrix(): number[][] {
    return this.generateRadioRiskMatric(this.radios, 5);
  }

  ngOnInit() {
    this.store.dispatch(new GetRadioViews());

    this.subscriptions.push(
      this.store.pipe(select(getRadioFilter)).subscribe(filters => (this.activeFilters = filters))
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
          filterSet: this.activeFilters
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

  onReset(): void {
    this.resetFilter.emit();
  }

  handleMatrixClick(data: any): void {
    console.info(data);
  }

  generateRadioRiskMatric(entities: any[], size: number): number[][] {
    const matrix = [...Array.from({ length: size })].map(x => [...Array.from({ length: size })].map(y => 0));
    for (const entity of entities) {
      const rowIndex = entity.severity - 1;
      const colIndex = entity.frequency - 1;
      matrix[rowIndex][colIndex]++;
    }
    return matrix;
  }
}
