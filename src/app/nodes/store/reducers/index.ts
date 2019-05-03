import * as fromNode from '../reducers/node.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/node.reducer';
import { NodeLink } from '../models/node-link.model';

export interface NodesState {
    loading: boolean;
    entities: Node[];
    selectedNode: Node;
    selectedNodeLink: NodeLink;
    links: NodeLink[];
    error: Error;
}

export const getNodeState = createFeatureSelector<State>('nodesFeature');

export const getNodes = createSelector(
  getNodeState,
  fromNode.getNodes
);

export const getSelectedNode = createSelector(
    getNodeState,
    fromNode.getSelectedNode
  );

export const getLoading = createSelector(
    getNodeState,
    fromNode.getLoading
);

export const getNodeLinks = createSelector(
    getNodeState,
    fromNode.getNodeLinks
);

export const getSelectedNodeLink = createSelector(
    getNodeState,
    fromNode.getSelectedNodeLink
);





