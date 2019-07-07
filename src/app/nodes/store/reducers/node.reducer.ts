import { Node, Error, NodeDetail } from '../models/node.model';
import { NodeLink } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';

export interface State {
  loading: boolean;
  entities: Node[];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLink;
  links: NodeLink[];
  error: Error;
}

export const initialState: State = {
  loading: false,
  entities: null,
  selectedNode: null,
  selectedNodeLink: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: NodeActionsUnion): State {
  switch (action.type) {

    case NodeActionTypes.LoadNodes: {
      return {
        ...initialState,
        loading: true
      };
    }

    case NodeActionTypes.LoadNodesSuccess: {
      return {
        ...state,
        loading: false,
        entities: [...action.payload]
      };
    }

    case NodeActionTypes.LoadNodeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case NodeActionTypes.LoadMapView: {
      return {
        ...state,
        loading: true
      };
    }

    case NodeActionTypes.LoadMapViewSuccess: {
      return {
        ...state,
        loading: false,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
      };
    }

    case NodeActionTypes.LoadMapViewFailure: {
      return {
        ...state,
        loading: false
      };
    }

    case NodeActionTypes.LoadNode: {
      return {
        ...state,
        loading: true
      };
    }

    case NodeActionTypes.LoadNodeSuccess: {
      return {
        ...state,
        loading: false,
        selectedNode: action.payload
      };
    }

    case NodeActionTypes.LoadNodeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case NodeActionTypes.LoadNodeLinks: {
        return {
          ...state,
          loading: true
        };
      }

      case NodeActionTypes.LoadNodeLinksSuccess: {
        return {
          ...state,
          loading: false,
          links: [...action.payload]
        };
      }

      case NodeActionTypes.LoadNodeLinksFailure: {
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      }

    case NodeActionTypes.LoadNodeLinksSuccess: {
      return {
        ...state,
        loading: false,
        links: action.payload
      };
    }

    case NodeActionTypes.LoadNodeLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
