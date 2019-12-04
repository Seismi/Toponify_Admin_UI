import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchService, SearchQueryParams } from '@app/core/services/search.service';
import { Search, SearchActionTypes, SearchSuccess, SearchFailure } from '../actions/search.actions';
import { SearchApiResponse } from '../models/search.models';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private searchService: SearchService) {}

  @Effect()
  search$ = this.actions$.pipe(
    ofType<Search>(SearchActionTypes.Search),
    map(action => action.payload),
    switchMap((queryParams: SearchQueryParams) => {
      return this.searchService.getSearchResults(queryParams).pipe(
        switchMap((response: SearchApiResponse) => [new SearchSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new SearchFailure(error)))
      );
    })
  );
}
