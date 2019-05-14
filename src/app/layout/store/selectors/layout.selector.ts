import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LayoutState } from '../reducers/layout.reducer';

export const getLayoutFeatureState = createFeatureSelector<LayoutState>('layoutFeature');

export const getLayoutEntities = createSelector(
  getLayoutFeatureState,
  state => state.entities
);

export const getLayoutSelected = createSelector(
  getLayoutFeatureState,
  state => state.selected
);

export const getLayoutLoading = createSelector(
  getLayoutFeatureState,
  state => state.loading
);

export const getLayoutError = createSelector(
  getLayoutFeatureState,
  state => state.error
);
