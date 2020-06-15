import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/architecture.reducer';

export const getWorkpackageFeatureState = createFeatureSelector<State>('architectureFeature');

export const getSelectedWorkpackages = createSelector(
  getWorkpackageFeatureState,
  state => state.selectedWorkpackages
);

export const getNodeScopes = createSelector(
  getWorkpackageFeatureState,
  state => state.nodeScopes
);

export const getNodeScopesAvailability = createSelector(
  getWorkpackageFeatureState,
  state => state.availableScopes
);

export const getPotentialWorkPackageNodes = createSelector(
  getWorkpackageFeatureState,
  state => state.descendants
);

export const getPotentialGroupMembers = createSelector(
  getWorkpackageFeatureState,
  state => state.members
);
