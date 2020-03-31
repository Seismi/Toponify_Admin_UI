import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { RouterStateUrl, State } from '../index';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';

const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getQueryParams: MemoizedSelector<RouterReducerState<RouterStateUrl>, Params> = createSelector(
  getRouterState,
  state => state.state.queryParams
);

export const getFilterLevelQueryParams: MemoizedSelector<Params, any> = createSelector(
  getQueryParams,
  state => {
    if (!state) {
      return null;
    }
    return state['filterLevel'];
  }
);

export const getScopeQueryParams: MemoizedSelector<Params, any> = createSelector(
  getQueryParams,
  state => {
    if (!state) {
      return null;
    }
    return state['scope'];
  }
);

export const getWorkPackagesQueryParams: MemoizedSelector<Params, any> = createSelector(
  getQueryParams,
  state => {
    if (!state) {
      return [];
    }
    if (!state['workpackages']) {
      return [];
    }
    return typeof state['workpackages'] === 'string' ? [state['workpackages']] : state['workpackages'];
  }
);

export const getNodeIdQueryParams: MemoizedSelector<Params, any> = createSelector(
  getQueryParams,
  state => {
    if (!state) {
      return null;
    }
    return state['id'];
  }
);
