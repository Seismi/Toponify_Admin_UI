import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/team.reducer';

export const getTeamFeatureState = createFeatureSelector<State>('teamFeature');

export const getTeamEntities = createSelector(
  getTeamFeatureState,
  state => state.entities
);

export const getTeamSelected = createSelector(
  getTeamFeatureState,
  state => state.selected
);

export const getTeamLoading = createSelector(
  getTeamFeatureState,
  state => state.loading
);

export const getTeamError = createSelector(
  getTeamFeatureState,
  state => state.error
);
