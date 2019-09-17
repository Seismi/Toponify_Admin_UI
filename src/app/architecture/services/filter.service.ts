import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class FilterService implements OnDestroy {
  public filter: BehaviorSubject<any>;
  private filterKey = 'filter';
  private queryParamSubscription: Subscription;

  constructor(public router: Router, private route: ActivatedRoute) {
    const filterString = this.route.snapshot.queryParams[this.filterKey];

    this.filter = new BehaviorSubject(
      filterString ? this.transformToObject(filterString) : null
    );

    this.queryParamSubscription = route.queryParams.subscribe(params => {
      const filters = params[this.filterKey];
      if (filters) {
        this.filter.next(this.transformToObject(filters));
      } else {
        this.filter.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
  }

  getFilter(): any {
    return this.filter.getValue();
  }

  setFilter(filter: any): void {
    const queryParams = {};
    if (filter) {
      queryParams[this.filterKey] = this.transformToString(filter);
    }
    this.router.navigate([], {
      queryParams: queryParams
    });
  }

  transformToString(filter: any): string {
    return this.filtersAsUrlQuery(filter);
  }

  transformToObject(filter: string): any {
    return this.filtersStringToObject(filter);
  }

  private filtersStringToObject(filtersString: string): any {
    const filters = {};

    if (filtersString !== null) {
      // Replaced space with "|" as in 2.0, "data set" and "reporting concept" layer names have spaces in them
      filtersString.split('|').forEach(filter => {
        if (filter.split(':').length === 2) {
          const [key, value] = filter.split(':');
          if (key && value) {
            const values = value.split(',');

            if (values.length === 1) {
              filters[key] = values.pop();
            } else {
              filters[key] = values.filter(item => item !== '');
            }
          }
        }
      });
    }
    return filters;
  }

  private filtersAsUrlQuery(filters: any): string {
    const queryStrings = [];
    Object.keys(filters).forEach(key => {
      if (typeof filters[key] === 'string') {
        queryStrings.push(`${key}:${filters[key]}`);
      }
      if (typeof filters[key] !== 'string') {
        queryStrings.push(`${key}:${filters[key].join(',')},`);
      }
    });
    return queryStrings.join('|');
  }
}
