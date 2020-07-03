import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioMatrix, RadioFilter } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import {
  getMergedRadioFilters,
  getRadioDefaultFilter,
  getRadioMatrix
} from '@app/radio/store/selectors/radio.selector';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export type RiskMatrixData = number[][];

enum MatrixColours {
  Critical = '#CE3C31',
  High = '#F99118',
  Medium = '#FFEE00',
  Low = '#9BEE11',
  Minor = '#00C444',
  Zero = '#919191'
}

@Component({
  selector: 'smi-risk-matrix-chart',
  templateUrl: './risk-matrix-chart.component.html',
  styleUrls: ['./risk-matrix-chart.component.scss']
})
export class RiskMatrixChartComponent implements OnInit, OnDestroy {
  // Colors to the matrix will be defined accordingly
  // x + y = colours array index
  public colours = [
    MatrixColours.Minor,
    MatrixColours.Minor,
    MatrixColours.Low,
    MatrixColours.Low,
    MatrixColours.Medium,
    MatrixColours.High,
    MatrixColours.High,
    MatrixColours.Critical,
    MatrixColours.Critical
  ];

  matrix$: Observable<RiskMatrixData>;

  private matrixRange = [];

  public defaultFilters: any = {};
  public analysisFilters: any = {};

  subscriptions: Subscription[] = [];

  @Input('colours')
  set setColours(colours: string[]) {
    this.colours = colours as MatrixColours[];
  }

  get selectedRiskMatrixCol(): number[] | null {
    if (this.defaultFilters && this.defaultFilters.severityRange && this.defaultFilters.frequencyRange) {
      const cords = [this.defaultFilters.severityRange.from, this.defaultFilters.frequencyRange.from];
      return cords;
    }
    return null;
  }

  constructor(private store: Store<RadioState>, private radioFilterService: RadioFilterService) {}

  ngOnInit() {
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

    this.subscriptions.push(
      this.store.pipe(select(getRadioDefaultFilter)).subscribe(defaultFilters => {
        this.defaultFilters = defaultFilters;
      })
    );

    this.subscriptions.push(
      this.store
        .pipe(
          select(getMergedRadioFilters),
          distinctUntilChanged(isEqual)
        )
        .subscribe(filters => {
          this.store.dispatch(
            new GetRadioMatrix({
              data: this.radioFilterService.transformFilterIntoAdvancedSearchData(filters, [
                'severityRange',
                'frequencyRange'
              ])
            })
          );
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  isSelected(x: number, y: number): boolean {
    if (!this.selectedRiskMatrixCol) {
      return false;
    }
    return this.selectedRiskMatrixCol[0] === x && this.selectedRiskMatrixCol[1] === y;
  }

  getColorAccordingIndex(index: number, col: number): string {
    if (col === 0) {
      return MatrixColours.Zero;
    }
    return this.colours[index] ? this.colours[index] : 'transparent';
  }

  handleColClick(x: number, y: number): void {
    this.store.dispatch(
      new RadioFilter({
        ...(!!this.defaultFilters && this.defaultFilters),
        ...this.matrixRange[x][y]
      })
    );
  }

  clearSelection(): void {
    const { frequencyRange, severityRange, ...rest } = this.defaultFilters;
    this.store.dispatch(
      new RadioFilter({
        ...rest
      })
    );
  }
}
