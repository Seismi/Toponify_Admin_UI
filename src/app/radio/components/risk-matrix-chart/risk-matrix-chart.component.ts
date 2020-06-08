import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioMatrix, RadioFilter } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioFilter, getRadioMatrix, getRadioAnalysisFilter } from '@app/radio/store/selectors/radio.selector';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { mergeWith, isArray } from 'lodash';

export type RiskMatrixData = number[][];

@Component({
  selector: 'smi-risk-matrix-chart',
  templateUrl: './risk-matrix-chart.component.html',
  styleUrls: ['./risk-matrix-chart.component.scss']
})
export class RiskMatrixChartComponent implements OnInit, OnDestroy {
  // Colors to the matrix will be defined accordingly
  // x + y = colours array index
  public colours = ['#00ce00', '#00ce00', '#6c9712', '#6c9712', '#f1b301', '#e97600', '#e97600', '#df1627', '#df1627'];

  matrix$: Observable<RiskMatrixData>;

  private matrixRange = [];

  public activeFilters: any = {};
  public analysisFilters: any = {};

  subscriptions: Subscription[] = [];

  @Input('colours')
  set setColours(colours: string[]) {
    this.colours = colours;
  }

  get selectedRiskMatrixCol(): number[] | null {
    if (this.activeFilters && this.activeFilters.severityRange && this.activeFilters.frequencyRange) {
      const cords = [this.activeFilters.severityRange.from, this.activeFilters.frequencyRange.from];
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
      combineLatest(this.store.pipe(select(getRadioFilter)), this.store.pipe(select(getRadioAnalysisFilter))).subscribe(
        ([defaultFilters, analysisFilters]) => {
          this.activeFilters = defaultFilters;
          const mergedFilters = mergeWith({ ...defaultFilters }, { ...analysisFilters }, (a, b) =>
            isArray(a) ? a.concat(b) : undefined
          );
          this.store.dispatch(
            new GetRadioMatrix({
              data: this.radioFilterService.transformFilterIntoAdvancedSearchData(mergedFilters, [
                'severityRange',
                'frequencyRange'
              ])
            })
          );
        }
      )
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

  getColorAccordingIndex(index: number): string {
    return this.colours[index] ? this.colours[index] : 'transparent';
  }

  handleColClick(x: number, y: number): void {
    this.store.dispatch(
      new RadioFilter({
        ...(!!this.activeFilters && this.activeFilters),
        ...this.matrixRange[x][y]
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
}
