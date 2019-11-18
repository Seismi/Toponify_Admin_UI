import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';
import {Error, Node, NodeDetail, OwnersEntity} from '../models/node.model';
import {
  WorkpackageActionsUnion,
  WorkpackageActionTypes
} from '../actions/workpackage.actions';
import {
  WorkPackageNodeActionsUnion,
  WorkPackageNodeActionTypes
} from '@app/workpackage/store/actions/workpackage-node.actions';
import { DescendantsEntity } from '@app/nodes/store/models/node.model';

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

export function reducer(
  state = initialState,
  action:
    | ViewActionsUnion
    | NodeActionsUnion
    | WorkpackageActionsUnion
    | WorkPackageNodeActionsUnion
): State {
  switch (action.type) {
    case WorkpackageActionTypes.SelectWorkpackage: {
      return {
        ...state,
        selectedWorkpackages: state.selectedWorkpackages.includes(
          action.payload
        )
          ? state.selectedWorkpackages.filter(id => id !== action.payload)
          : [...state.selectedWorkpackages, action.payload]
      };
    }

    case WorkPackageNodeActionTypes.AddWorkpackageNodeOwnerSuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case WorkPackageNodeActionTypes.AddWorkpackageNodeOwnerFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwnerSuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwnerFailure: {
      return {
        ...state,
        error: action.payload
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
        links: [...action.payload.links]
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
        links: [...action.payload.links]
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

    case NodeActionTypes.UpdateCustomProperty: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateCustomPropertySuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case NodeActionTypes.UpdateCustomPropertyFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    case NodeActionTypes.DeleteCustomProperty: {
      return {
        ...state,
      };
    }

    case NodeActionTypes.DeleteCustomPropertySuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case NodeActionTypes.DeleteCustomPropertyFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.UpdateNodeDescendants: {
      const {nodeId, descendants} = <{descendants: DescendantsEntity[], nodeId: string}>action.payload;
      const nodeIndex = state.entities.findIndex(n => n.id === nodeId);
      if (nodeIndex > -1) {
        const updatedNode = {...state.entities[nodeIndex], descendants: descendants};
        const entities = [...state.entities];
        entities[nodeIndex] = updatedNode;
        if (state.selectedNode.id ===  nodeId) {
          return  {
            ...state,
            entities,
            selectedNode: updatedNode
          };
        }
        return {
          ...state,
          entities,
        };
      } else {
        return {
          ...state
        };
      }
    }

    case NodeActionTypes.UpdateNodeOwners: {
      const {nodeId, owners} = <{owners: OwnersEntity[], nodeId: string}>action.payload;
      const nodeIndex = state.entities.findIndex(n => n.id === nodeId);
      if (nodeIndex > -1) {
        const updatedNode = {...state.entities[nodeIndex], owners: owners};
        const entities = [...state.entities];
        entities[nodeIndex] = updatedNode;
        if (state.selectedNode.id ===  nodeId) {
          return  {
            ...state,
            entities,
            selectedNode: updatedNode
          };
        }
        return {
          ...state,
          entities,
        };
      } else {
        return {
          ...state
        };
      }
    }

    default: {
      return state;
    }
  }
}
