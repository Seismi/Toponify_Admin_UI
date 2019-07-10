import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/node.reducer';

export const getNodeFeatureState = createFeatureSelector<State>('nodeFeature');

export const getSelectedNode = createSelector(
  getNodeFeatureState,
  state => state.selectedNode
);

export const getNodeLinks = createSelector(
  getNodeFeatureState,
  (state: State) => {
    return state.links;
  }
);

export const getNodeEntities = createSelector(
  getNodeFeatureState,
  (state: State) => {
    return state.entities;
  }
);

export const getSelectedNodeLink = createSelector(
  getNodeFeatureState,
  state => state.selectedNodeLink
);


export const getError = createSelector(
  getNodeFeatureState,
  state => state.error
);
