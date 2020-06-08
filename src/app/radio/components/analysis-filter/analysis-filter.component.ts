import { Component, OnDestroy, OnInit } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioAnalysis, SetRadioAnalysisFilter } from '@app/radio/store/actions/radio.actions';
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
  activeFilters: any = {};
  analysisFilters: any = {};
  test = {};

  excludeMatrixFilter = false;

  analysis: AnalysisProp;

  private subscriptions: Subscription[] = [];

  get sections(): string[] {
    return this.analysis ? Object.keys(this.analysis) : [];
  }

  constructor(private store: Store<RadioState>, private radioFilterService: RadioFilterService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getRadioFilter)).subscribe(filters => {
        if (
          filters.severityRange &&
          !this.activeFilters.severityRange &&
          Object.keys(this.analysisFilters).length > 0
        ) {
          const { severityRange, frequencyRange, ...rest } = filters;
          this.activeFilters = rest;
        } else {
          this.activeFilters = filters;
        }
        this.store.dispatch(
          new GetRadioAnalysis({
            data: this.radioFilterService.transformFilterIntoAdvancedSearchData(this.activeFilters)
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

    if (this.isSelected(filterKey, filterValue)) {
      filters[filterKey] = filters[filterKey].filter(value => !isEqual(value, filterValue));
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
    if (this.analysisFilters && this.analysisFilters[filterKey]) {
      return !!this.analysisFilters[filterKey].find(value => isEqual(value, filterValue));
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
