import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { RouterStateUrl, State } from '../index';
import { Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';

const getRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getQueryParams: MemoizedSelector<RouterReducerState<RouterStateUrl>, Params> = createSelector(
  getRouterState,
  state => state.state.queryParams
);

export const getFilterLevelQueryParams: MemoizedSelector<Params, any> = createSelector(getQueryParams, state => {
  if (!state) {
    return null;
  }
  return state['filterLevel'];
});

export const getScopeQueryParams: MemoizedSelector<Params, any> = createSelector(getQueryParams, state => {
  if (!state) {
    return null;
  }
  return state['scope'];
});

export const getWorkPackagesQueryParams: MemoizedSelector<Params, any> = createSelector(getRouterState, state => {
  const { url, queryParams } = state.state;
  if (url.indexOf('topology') === -1) {
    return null;
  }
  if (!queryParams) {
    return [];
  }
  if (!queryParams['workpackages']) {
    return [];
  }
  return typeof queryParams['workpackages'] === 'string' ? [queryParams['workpackages']] : queryParams['workpackages'];
});

export const getNodeIdQueryParams: MemoizedSelector<Params, any> = createSelector(getQueryParams, state => {
  if (!state) {
    return null;
  }
  return state['id'];
});

export const getMapViewQueryParams: MemoizedSelector<Params, any> = createSelector(getQueryParams, state => {
  if (!state) {
    return null;
  }
  return {
    id: state['id'],
    isTransformation: state['isTransformation']
  };
});
