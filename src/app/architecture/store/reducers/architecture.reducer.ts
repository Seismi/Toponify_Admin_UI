import { HttpErrorResponse } from '@angular/common/http';
import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';
import { NodeDetail, Node, Error } from '../models/node.model';
import { WorkpackageActionsUnion, WorkpackageActionTypes } from '../actions/workpackage.actions';

export interface State {
  zoomLevel: number;
  viewLevel: number;
  entities: Node[];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLinkDetail;
  links: NodeLink[];
  error: Error;
  selectedWorkpackages: string[];
}

export const initialState: State = {
  zoomLevel: 3,
  viewLevel: 1,
  entities: null,
  selectedNode: null,
  selectedNodeLink: null,
  links: null,
  error: null,
  selectedWorkpackages: []
};

export function reducer(state = initialState, action: ViewActionsUnion | NodeActionsUnion | WorkpackageActionsUnion): State {
  switch (action.type) {

    case WorkpackageActionTypes.SelectWorkpackage: {
      return {
        ...state,
        selectedWorkpackages: state.selectedWorkpackages.includes(action.payload)
          ? state.selectedWorkpackages.filter(id => id !== action.payload)
          : [...state.selectedWorkpackages, action.payload]
      };
    }

    case ViewActionTypes.ViewModel: {
      return {
        ...state,
        viewLevel: action.payload
      };
    }

    case ViewActionTypes.ZoomModel: {
      return {
        ...state,
        zoomLevel: action.payload
      };
    }

    case NodeActionTypes.LoadNodesSuccess: {
      return {
        ...state,
        entities: [...action.payload]
      };
    }

    case NodeActionTypes.LoadNodeFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.LoadMapViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
      };
    }

    case NodeActionTypes.LoadMapViewFailure: {
      return {
        ...state,
        error: action.payload
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

    case NodeActionTypes.LoadNodeSuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case NodeActionTypes.LoadNodeFailure: {
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

    case NodeActionTypes.LoadNodeLinkSuccess: {
      return {
        ...state,
        selectedNodeLink: action.payload
      };
    }

    case NodeActionTypes.LoadNodeLinkFailure: {
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

    case NodeActionTypes.UpdateNodeSuccess: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateNodeFailure: {
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
