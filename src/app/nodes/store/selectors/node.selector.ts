import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/node.reducer';

export const getNodeFeatureState = createFeatureSelector<State>('nodeFeature');

export const getNodeEntities = createSelector(
  getNodeFeatureState,
  state => state.entities
);

export const getSelectedNode = createSelector(
  getNodeFeatureState,
  state => state.selectedNode
);

export const getNodeLinks = createSelector(
  getNodeFeatureState,
  state => state.links
);

export const getSelectedNodeLink = createSelector(
  getNodeFeatureState,
  state => state.selectedNodeLink
);

export const getLoading = createSelector(
  getNodeFeatureState,
  state => state.loading
);

export const getError = createSelector(
  getNodeFeatureState,
  state => state.error
);
