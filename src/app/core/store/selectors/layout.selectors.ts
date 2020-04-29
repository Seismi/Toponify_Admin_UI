import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LayoutState } from '../reducers/layout.reducer';

export const getLayoutFeatureState = createFeatureSelector<LayoutState>('layout');

export const getSelectedLeftDrawerTab = createSelector(
  getLayoutFeatureState,
  state => state.selectedLeftDrawerTab
);
