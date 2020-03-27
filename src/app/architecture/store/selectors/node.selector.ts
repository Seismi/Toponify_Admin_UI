import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/architecture.reducer';
import { LoadingStatus } from '@app/architecture/store/models/node.model';

export const getNodeFeatureState = createFeatureSelector<State>('architectureFeature');

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

export const getNodeReports = createSelector(
  getNodeFeatureState,
  state => state.reports
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

export const getNodeEntityById = createSelector(
  getNodeFeatureState,
  (state: State, props: { id: string }) => {
    if (!state.entities) {
      return null;
    }
    return state.entities.find(item => item.id === props.id);
  }
);

export const getParentDescendantIds = createSelector(
  getNodeFeatureState,
  (state: State) => {
    return state.parentNodeDescendantIds;
  }
);

export const getGroupMemberIds = createSelector(
  getNodeFeatureState,
  (state: State) => {
    return state.groupMemberIds;
  }
);

export const getAvailableTags = createSelector(
  getNodeFeatureState,
  state => state.availableTags
);

export const getTags = createSelector(
  getNodeFeatureState,
  state => state.tags
);

export const getDraft = createSelector(
  getNodeFeatureState,
  state => state.draft
);

export const getNodeLoadingStatus = createSelector(
  getNodeFeatureState,
  state => state.loadingNode
);

export const getNodeLinkLoadingStatus = createSelector(
  getNodeFeatureState,
  state => state.loadingLink
);

export const getTopologyLoadingStatus = createSelector(
  getNodeFeatureState,
  state => {
    if (state.loadingLinks === LoadingStatus.loaded && state.loadingNodes === LoadingStatus.loaded) {
      return LoadingStatus.loaded;
    }
    if (state.loadingLinks === LoadingStatus.error || state.loadingNodes === LoadingStatus.error) {
      return LoadingStatus.error;
    }
    return LoadingStatus.loading;
  }
);
