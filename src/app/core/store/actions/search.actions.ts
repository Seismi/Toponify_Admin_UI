import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchApiResponse } from '../models/search.models';

export enum SearchActionTypes {
  Search = '[Search] Search',
  SearchSuccess = '[Search] Search Success',
  SearchFailure = '[Search] Search Failure'
}

export class Search implements Action {
  readonly type = SearchActionTypes.Search;
  constructor(public payload?: any) { }
}

export class SearchSuccess implements Action {
  readonly type = SearchActionTypes.SearchSuccess;
  constructor(public payload: SearchApiResponse) { }
}

export class SearchFailure implements Action {
  readonly type = SearchActionTypes.SearchFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export type SearchActionsUnion = Search | SearchSuccess | SearchFailure;