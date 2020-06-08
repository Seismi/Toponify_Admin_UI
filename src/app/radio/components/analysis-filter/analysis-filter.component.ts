import { Component, OnDestroy, OnInit } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioAnalysis, SetRadioAnalysisFilter, RadioFilter } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioAnalysis, getRadioAnalysisFilter, getRadioFilter } from '@app/radio/store/selectors/radio.selector';
import { select, Store } from '@ngrx/store';
import isEqual from 'lodash.isequal';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface AnalysisProp {
  [key: string]: {
    filterValue: any;
    label: string;
    count: number;
  }[];
}

const mappedFilterKeys = {
  categories: 'type'
};

@Component({
  selector: 'app-analysis-filter',
  templateUrl: './analysis-filter.component.html',
  styleUrls: ['./analysis-filter.component.scss']
})
export class AnalysisFilterComponent implements OnInit, OnDestroy {
  defaultFilters: any = {};
  analysisFilters: any = {};
  test = {};

  excludeMatrixFilter = false;

  analysis: AnalysisProp;

  private subscriptions: Subscription[] = [];

  get sections(): string[] {
    return this.analysis ? Object.keys(this.analysis) : [];
  }

  hasSetFilters(): boolean {
    return this.analysisFilters && Object.keys(this.analysisFilters).length > 0;
  }

  constructor(private store: Store<RadioState>, private radioFilterService: RadioFilterService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getRadioFilter)).subscribe(filters => {
        if (
          filters.severityRange &&
          !this.defaultFilters.severityRange &&
          Object.keys(this.analysisFilters).length > 0
        ) {
          const { severityRange, frequencyRange, ...rest } = filters;
          this.defaultFilters = rest;
        } else {
          this.defaultFilters = filters;
        }
        this.store.dispatch(
          new GetRadioAnalysis({
            data: this.radioFilterService.transformFilterIntoAdvancedSearchData(this.defaultFilters)
          })
        );
      })
    );

    this.subscriptions.push(
      this.store
        .pipe(select(getRadioAnalysisFilter))
        .subscribe(analysisFilters => (this.analysisFilters = analysisFilters || {}))
    );

    this.subscriptions.push(
      this.store
        .pipe(
          select(getRadioAnalysis),
          filter(data => data && data.analysis),
          map(data => data.analysis)
        )
        .subscribe(data => {
          this.analysis = data;
          this.sections.forEach(filterKey => {
            if (!this.test[filterKey]) {
              this.test[filterKey] = true;
            }
          });
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  selectFilter(filterKey: string, filterValue: any): void {
    filterKey = mappedFilterKeys[filterKey] || filterKey;
    const filters = {
      ...(!!this.analysisFilters && this.analysisFilters)
    };

    if (this.isSelectedAsDefault(filterKey, filterValue)) {
      this.store.dispatch(
        new RadioFilter({
          ...this.defaultFilters,
          [filterKey]: this.defaultFilters[filterKey].filter(value => !isEqual(value, filterValue))
        })
      );
      return;
    }

    if (this.isSelected(filterKey, filterValue)) {
      filters[filterKey] = filters[filterKey].filter(value => !isEqual(value, filterValue));
      if (filters[filterKey].length === 0) {
        delete filters[filterKey];
      }
    } else {
      if (filters[filterKey]) {
        filters[filterKey] = [...filters[filterKey], filterValue];
      } else {
        filters[filterKey] = [filterValue];
      }
    }
    this.store.dispatch(new SetRadioAnalysisFilter(filters));
  }

  isSelected(filterKey: string, filterValue: any): boolean {
    filterKey = mappedFilterKeys[filterKey] || filterKey;
    if (this.isSelectedAsDefault(filterKey, filterValue)) {
      return true;
    }
    return this.isSelectedAsAnalysis(filterKey, filterValue);
  }

  isSelectedAsAnalysis(filterKey: string, filterValue: any): boolean {
    if (this.analysisFilters && this.analysisFilters[filterKey]) {
      return !!this.analysisFilters[filterKey].find(value => isEqual(value, filterValue));
    }
    return false;
  }

  isSelectedAsDefault(filterKey: string, filterValue: any): boolean {
    if (this.defaultFilters && this.defaultFilters[filterKey]) {
      return !!this.defaultFilters[filterKey].find(value => isEqual(value, filterValue));
    }
    return false;
  }

  isSectionOpen(filterKey: string): boolean {
    return this.test[filterKey];
  }

  toggleSection(filterKey: string): void {
    this.test[filterKey] = !this.test[filterKey];
  }

  clearSelection(): void {
    this.store.dispatch(new SetRadioAnalysisFilter({}));
  }
}
