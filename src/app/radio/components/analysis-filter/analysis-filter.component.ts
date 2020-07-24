import { Component, OnDestroy, OnInit } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioAnalysis, SetRadioAnalysisFilter } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import {
  getRadioAnalysis,
  getRadioAnalysisFilter,
  getRadioDefaultFilter
} from '@app/radio/store/selectors/radio.selector';
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
  private subscriptions: Subscription[] = [];

  defaultFilters: any = {};
  analysisFilters: any = {};
  private sectionsOpen = {};

  excludeMatrixFilter = false;

  analysis: AnalysisProp;

  get sections(): string[] {
    return this.analysis ? Object.keys(this.analysis) : [];
  }

  hasSetFilters(): boolean {
    return this.analysisFilters && Object.keys(this.analysisFilters).length > 0;
  }

  constructor(private store: Store<RadioState>, private radioFilterService: RadioFilterService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getRadioDefaultFilter)).subscribe(defaultFilters => {
        this.defaultFilters = defaultFilters;
        this.store.dispatch(
          new GetRadioAnalysis({
            data: this.radioFilterService.disableFilters(defaultFilters, ['severityRange', 'frequencyRange'])
          })
        );
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getRadioAnalysisFilter)).subscribe(analysisFilters => {
        this.analysisFilters = analysisFilters || {};
      })
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
            if (!this.sectionsOpen[filterKey]) {
              this.sectionsOpen[filterKey] = true;
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
    const currentAnalysisFilters = {
      ...(!!this.analysisFilters && this.analysisFilters)
    };
    if (this.isSelected(filterKey, filterValue)) {
      currentAnalysisFilters[filterKey] = currentAnalysisFilters[filterKey].filter(
        value => !isEqual(value, filterValue)
      );
      if (currentAnalysisFilters[filterKey].length === 0) {
        delete currentAnalysisFilters[filterKey];
      }
    } else {
      if (currentAnalysisFilters[filterKey]) {
        currentAnalysisFilters[filterKey] = [...currentAnalysisFilters[filterKey], filterValue];
      } else {
        currentAnalysisFilters[filterKey] = [filterValue];
      }
    }
    this.store.dispatch(new SetRadioAnalysisFilter(currentAnalysisFilters));
  }

  isSelected(filterKey: string, filterValue: any): boolean {
    filterKey = mappedFilterKeys[filterKey] || filterKey;
    if (this.analysisFilters && this.analysisFilters[filterKey]) {
      return !!this.analysisFilters[filterKey].find(value => isEqual(value, filterValue));
    }
    return false;
  }

  isSectionOpen(filterKey: string): boolean {
    return this.sectionsOpen[filterKey];
  }

  toggleSection(filterKey: string): void {
    this.sectionsOpen[filterKey] = !this.sectionsOpen[filterKey];
  }

  clearSelection(): void {
    this.store.dispatch(new SetRadioAnalysisFilter({}));
  }
}
