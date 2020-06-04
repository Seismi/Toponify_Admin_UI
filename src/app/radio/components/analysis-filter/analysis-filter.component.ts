import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RadioFilterService } from '@app/radio/services/radio-filter.service';
import { GetRadioAnalysis, RadioFilter } from '@app/radio/store/actions/radio.actions';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioAnalysis, getRadioFilter } from '@app/radio/store/selectors/radio.selector';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import isEqual from 'lodash.isequal';

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
export class AnalysisFilterComponent implements OnInit {
  activeFilters = null;
  test = {};
  @Input() set data(data: AnalysisProp) {
    this.analysis = data;
    this.sections.forEach(filterKey => {
      if (!this.test[filterKey]) {
        this.test[filterKey] = true;
      }
    });
  }
  analysis: AnalysisProp;
  @Input() selected: any;
  @Output() select = new EventEmitter();

  get sections(): string[] {
    return this.analysis ? Object.keys(this.analysis) : [];
  }

  constructor(private store: Store<RadioState>, private radioFilterService: RadioFilterService) {}

  ngOnInit() {
    this.store.pipe(select(getRadioFilter)).subscribe(filters => {
      this.activeFilters = filters;
      this.store.dispatch(
        new GetRadioAnalysis({
          data: this.radioFilterService.transformFilterIntoAdvancedSearchData(this.activeFilters)
        })
      );
    });

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
      });
  }

  selectFilter(filterKey: string, filterValue: any): void {
    filterKey = mappedFilterKeys[filterKey] || filterKey;
    const filters = {
      ...(!!this.activeFilters && this.activeFilters)
    };

    if (this.isSelected(filterKey, filterValue)) {
      filters[filterKey] = filters[filterKey].filter(value => {
        if (typeof value === 'object' && value.id) {
          return value.id !== filterValue.id;
        } else {
          return value !== filterValue;
        }
      });
    } else {
      if (filters[filterKey]) {
        filters[filterKey] = [...filters[filterKey], filterValue];
      } else {
        filters[filterKey] = [filterValue];
      }
    }
    this.store.dispatch(new RadioFilter(filters));
  }

  isSelected(filterKey: string, filterValue: any): boolean {
    filterKey = mappedFilterKeys[filterKey] || filterKey;
    if (this.activeFilters && this.activeFilters[filterKey]) {
      if (typeof filterValue === 'object' && filterValue.id) {
        return !!this.activeFilters[filterKey].find(val => val.id === filterValue.id);
      } else {
        return !!this.activeFilters[filterKey].find(val => val === filterValue);
      }
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
    const filters = { ...this.activeFilters } || {};
    this.sections.forEach(filterKey => {
      filterKey = mappedFilterKeys[filterKey];
      filters[filterKey] = null;
    });
    this.store.dispatch(new RadioFilter(filters));
  }
}
