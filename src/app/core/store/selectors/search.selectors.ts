import { State as SearchState } from '../reducers/search.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getSearchFeatureState = createFeatureSelector<SearchState>('searchFeature');

export const getSearchResults = createSelector(
  getSearchFeatureState,
  state => state.entities
);
