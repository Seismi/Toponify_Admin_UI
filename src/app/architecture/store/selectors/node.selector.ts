import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/architecture.reducer';
import { Level } from '@app/architecture/services/diagram-level.service';

export const getNodeFeatureState = createFeatureSelector<State>(
  'architectureFeature'
);

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

export const getNodeLinksBy = createSelector(
  getNodeFeatureState,
  (state: State, props?: { layer?: string; id?: string }) => {
    if (!state.links) {
      return null;
    }
    const { layer } = props;
    if (!layer) {
      return state.links;
    }
    if (layer.endsWith('map')) {
      return state.entities;
    }
    return state.links.filter(item => item.layer === layer);
  }
);

export const getNodeEntitiesBy = createSelector(
  getNodeFeatureState,
  (state: State, props?: { layer?: string; id?: string }) => {
    if (!state.entities) {
      return null;
    }
    const { layer, id } = props;
    if (!layer) {
      return state.entities;
    }

    if (layer.endsWith('map')) {
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
