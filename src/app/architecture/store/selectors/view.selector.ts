import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/view.reducer';

export const getViewFeatureState = createFeatureSelector<State>('architectureFeature');

export const getZoomLevel = createSelector(
  getViewFeatureState,
  state => state.zoomLevel
);

export const getViewLevel = createSelector(
  getViewFeatureState,
  state => state.viewLevel
);
