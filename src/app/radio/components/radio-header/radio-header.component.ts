import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { RouterStateUrl } from '@app/core/store';
import { UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { getQueryParams } from '@app/core/store/selectors/route.selectors';
import {
  CreateRadioViewSuccess,
  DeleteRadioView,
  GetRadioAnalysis,
  GetRadioMatrix,
  GetRadioView,
  GetRadioViews,
  RadioFilter,
  SetRadioViewAsFavourite,
  UnsetRadioViewAsFavourite,
  UpdateRadioView
} from '@app/radio/store/actions/radio.actions';
import { AdvancedSearchApiRequest, RadiosAdvancedSearch } from '@app/radio/store/models/radio.model';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import {
  getRadioAnalysis,
  getRadioEntities,
  getRadioFilter,
  getRadioMatrix,
  getRadioViews
} from '@app/radio/store/selectors/radio.selector';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { BehaviorSubject, combineLatest, Subscription, Observable } from 'rxjs';
import { distinctUntilChanged, map, filter } from 'rxjs/operators';
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
  public activeFilters = null;
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

  private matrixRange = [];

  public matrix$: Observable<any>;
  public analysis$: Observable<any>;

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

  get radioRiskMatrix(): number[][] {
    return this.generateRadioRiskMatric(this.radios, 5);
  }

  get selectedRiskMatrixCol(): number[] | null {
    if (this.activeFilters && this.activeFilters.severityRange && this.activeFilters.frequencyRange) {
      const cords = [this.activeFilters.severityRange.from, this.activeFilters.frequencyRange.from];
      return cords;
    }
    return null;
  }

  ngOnInit() {
    this.store.dispatch(new GetRadioViews());
    this.subscriptions.push(
      this.store.pipe(select(getRadioFilter)).subscribe(filters => {
        this.activeFilters = filters;
        if (filters && filters.tableStyle) {
          this.selectedTableStyle.next(filters.tableStyle);
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
          }
        })
    );

    this.subscriptions.push(
      this.selectedTableStyle.subscribe(style => {
        if (style === TableStyles.MANAGEMENT) {
          this.store.dispatch(
            new GetRadioMatrix({
              data: this.transformFilterIntoAdvancedSearchData(this.activeFilters)
            } as AdvancedSearchApiRequest)
          );
          this.store.dispatch(
            new GetRadioAnalysis({
              data: this.transformFilterIntoAdvancedSearchData(this.activeFilters)
            } as AdvancedSearchApiRequest)
          );
        }
      })
    );

    this.matrix$ = this.store.pipe(select(getRadioMatrix)).pipe(
      filter(data => data && data.managementMatrix),
      map(data => {
        const matrix = [...Array.from({ length: 5 })].map(x => [...Array.from({ length: 5 })].map(y => 0));
        this.matrixRange = [...Array.from({ length: 5 })].map(x => [...Array.from({ length: 5 })].map(y => 0));
        data.managementMatrix.forEach(r => {
          r.items.forEach(c => {
            const value = c.count;
            matrix[r.severity - 1][c.frequency - 1] = value;
            this.matrixRange[r.severity - 1][c.frequency - 1] = {
              severityRange: r.severityRange,
              frequencyRange: c.frequencyRange
            };
          });
        });
        return matrix;
      })
    );

    this.analysis$ = this.store.pipe(
      select(getRadioAnalysis),
      filter(data => data && data.analysis),
      map(data => data.analysis)
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

  onRadioTableStyleSelect(tableStyle: TableStyles): void {
    this.store.dispatch(
      new RadioFilter({
        ...this.activeFilters,
        tableStyle: tableStyle
      })
    );
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

  handleMatrixClick(data: any): void {
    this.store.dispatch(
      new RadioFilter({
        ...(!!this.activeFilters && this.activeFilters),
        ...this.matrixRange[data[0]][data[1]]
      })
    );
  }

  clearSelection(): void {
    const { frequencyRange, severityRange, ...rest } = this.activeFilters;
    this.store.dispatch(
      new RadioFilter({
        ...rest
      })
    );
  }

  generateRadioRiskMatric(entities: any[], size: number): number[][] {
    const matrix = [...Array.from({ length: size })].map(x => [...Array.from({ length: size })].map(y => 0));
    for (const entity of entities) {
      const colIndex = entity.severity - 1;
      const rowIndex = entity.frequency - 1;
      matrix[rowIndex][colIndex]++;
    }
    return matrix;
  }

  analysisFilterSelected(data: any): void {
    console.info(data);
  }

  transformFilterIntoAdvancedSearchData(data: any): RadiosAdvancedSearch {
    return {
      status: {
        enabled: this.isFilterEnabled(data.status),
        values: data.status
      },
      type: {
        enabled: this.isFilterEnabled(data.type),
        values: data.type
      },
      assignedTo: {
        enabled: this.isFilterEnabled(data.assignedTo),
        values: data.assignedTo
      },
      relatesTo: {
        enabled: this.isFilterEnabled(data.relatesTo),
        includeDescendants: this.isFilterEnabled(data.relatesTo),
        includeLinks: this.isFilterEnabled(data.relatesTo),
        values: data.relatesTo
      },
      dueDate: {
        enabled: this.isFilterEnabled(data.from) || this.isFilterEnabled(data.to),
        from: data.from,
        to: data.to
      },
      text: {
        enabled: this.isFilterEnabled(data.text),
        value: data.text
      }
      // severityRange: {
      //   enabled: this.isFilterEnabled(data.severityRange),
      //   from: data.severityRange && data.severityRange.from ? data.severityRange.from : 0,
      //   to: data.severityRange && data.severityRange.to ? data.severityRange.to : 0
      // },
      // frequencyRange: {
      //   enabled: this.isFilterEnabled(data.frequencyRange),
      //   from: data.frequencyRange && data.frequencyRange.from ? data.frequencyRange.from : 0,
      //   to: data.frequencyRange && data.frequencyRange.to ? data.frequencyRange.to : 0
      // }
    };
  }

  isFilterEnabled(filter: string | boolean | [] | number): boolean {
    if (Array.isArray(filter) && filter.length === 0) {
      return false;
    }
    if (Number.isInteger(filter as any)) {
      return true;
    }
    return !!filter;
  }
}
