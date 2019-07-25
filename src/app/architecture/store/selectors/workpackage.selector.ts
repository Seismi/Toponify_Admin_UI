import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/architecture.reducer';

export const getWorkpackageFeatureState = createFeatureSelector<State>('architectureFeature');

export const getSelectedWorkpackages = createSelector(
  getWorkpackageFeatureState,
  state => state.selectedWorkpackages
);
