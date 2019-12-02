import { Node, Error, NodeDetail } from '../models/node.model';
import { NodeLink } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';

// TODO: node store should be moved under architecture module.

export interface State {
  entities: Node[];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLink;
  links: NodeLink[];
  error: Error;
}

export const initialState: State = {
  entities: null,
  selectedNode: null,
  selectedNodeLink: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: NodeActionsUnion): State {
  switch (action.type) {

    case NodeActionTypes.LoadNodesSuccess: {
      return {
        ...state,
        entities: [...action.payload]
      };
    }

    case NodeActionTypes.LoadNodeUsageViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
      };
    }

    case NodeActionTypes.LoadNodeUsageViewFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.LoadNodeLinksSuccess: {
      return {
        ...state,
        links: [...action.payload]
      };
    }

    case NodeActionTypes.LoadNodeLinksFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.UpdateLinksSuccess: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateLinksFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.UpdateNodesSuccess: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateNodesFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
