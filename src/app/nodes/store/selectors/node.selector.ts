import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/node.reducer';

export const getNodeFeatureState = createFeatureSelector<State>('nodeFeature');

export const getSelectedNode = createSelector(
  getNodeFeatureState,
  state => state.selectedNode
);

export const getNodeLinks = createSelector(
  getNodeFeatureState,
  (state: State, props?: {layer?: string, id?: string}) => {
    if (!state.links) {
      return null;
    }
    const { layer } = props;
    if (!layer) {
      return state.links;
    }
    return state.links.filter(item => item.layer === layer);
  }
);

export const getNodeEntities = createSelector(
  getNodeFeatureState,
  (state: State, props?: {layer?: string, id?: string}) => {
    if (!state.entities) {
      return null;
    }
    const { layer, id } = props;
    if (!layer) {
      return state.entities;
    }
    const filteredNodes = state.entities.filter(item => item.layer === layer);
    if (id) {
      const parentNode = state.entities.find(item => item.id === id);
      const childNodeIds = parentNode.descendants.map(item => item.id);
      return filteredNodes.filter(item => childNodeIds.includes(item.id));
    }
    return filteredNodes;
  }
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
