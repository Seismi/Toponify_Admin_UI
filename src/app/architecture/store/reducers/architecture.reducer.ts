import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';
import { Error, Node, NodeDetail, OwnersEntity } from '../models/node.model';
import { WorkpackageActionsUnion, WorkpackageActionTypes } from '../actions/workpackage.actions';
import {
  WorkPackageNodeActionsUnion,
  WorkPackageNodeActionTypes
} from '@app/workpackage/store/actions/workpackage-node.actions';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import {
  WorkPackageLinkActionTypes,
  WorkPackageLinkActionsUnion
} from '@app/workpackage/store/actions/workpackage-link.actions';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';

export interface State {
  zoomLevel: number;
  viewLevel: number;
  entities: Node[];
  descendants: DescendantsEntity[];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLinkDetail;
  links: NodeLink[];
  nodeScopes: WorkPackageNodeScopes[];
  availableScopes: WorkPackageNodeScopes[];
  error: Error;
  selectedWorkpackages: string[];
}

export const initialState: State = {
  zoomLevel: 3,
  viewLevel: 1,
  entities: [],
  selectedNode: null,
  selectedNodeLink: null,
  links: [],
  descendants: [],
  nodeScopes: [],
  availableScopes: [],
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
    | WorkPackageLinkActionsUnion
): State {
  switch (action.type) {
    case WorkpackageActionTypes.SelectWorkpackage: {
      return {
        ...state,
        selectedWorkpackages: state.selectedWorkpackages.includes(action.payload)
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

    case WorkPackageNodeActionTypes.UpdateWorkPackageNodeSuccess: {
      return {
        ...state,
        entities: state.entities.map(entity =>
          entity.id === action.payload.data.id ? { ...entity, ...action.payload.data } : entity
        )
      };
    }

    case WorkPackageNodeActionTypes.UpdateWorkPackageNodeFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    case WorkPackageNodeActionTypes.LoadWorkPackageNodeScopes: {
      return {
        ...state
      };
    }

    case WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesSuccess: {
      return {
        ...state,
        nodeScopes: action.payload
      };
    }

    case WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesFailure: {
      return {
        ...state
      };
    }

    case WorkPackageNodeActionTypes.DeleteWorkPackageNodeScope: {
      return {
        ...state
      };
    }

    case WorkPackageNodeActionTypes.DeleteWorkPackageNodeScopeSuccess: {
      return {
        ...state,
        nodeScopes: state.nodeScopes.filter(scope => scope.id !== action.payload.id)
      };
    }

    case WorkPackageNodeActionTypes.DeleteWorkPackageNodeScopeFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    case WorkPackageLinkActionTypes.UpdateWorkPackageLinkSuccess: {
      return {
        ...state,
        links: state.links.map(link =>
          link.id === action.payload.data.id ? { ...link, ...action.payload.data } : link
        )
      };
    }

    case WorkPackageLinkActionTypes.UpdateWorkPackageLinkFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    case WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailabilitySuccess: {
      return {
        ...state,
        availableScopes: action.payload
      };
    }

    case WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailabilityFailure: {
      return {
        ...state,
        error: <Error>action.payload
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

    case NodeActionTypes.UpdateNodeLocations: {
      const { layoutId, nodes } = action.payload;
      return nodes.reduce(
        function(updatedState, node) {
          const nodeIndex = updatedState.entities.findIndex(n => n.id === node.id);
          if (nodeIndex > -1) {
             return replaceNodeLocation(updatedState, nodeIndex, node.id, layoutId, node.locationCoordinates);
          }
        },
        {
          ...state
        }
      );
    }

    case NodeActionTypes.UpdateNodeExpandedState: {
      const { layoutId, data } = action.payload;
      const nodeIndex = state.entities.findIndex(n => n.id === data.data.id);
      if (nodeIndex > -1) {
         return replaceNodeExpandedState(state, nodeIndex, data.data.id, layoutId,
           {
             middleExpanded: data.data.middleExpanded,
             bottomExpanded: data.data.bottomExpanded
           }
         );
      } else {
        return {
          ...state
        };
      }
    }

    case NodeActionTypes.UpdateNodeLocationsSuccess: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateNodeLocationsFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case NodeActionTypes.UpdateNodeExpandedStateSuccess: {
      return {
        ...state
      };
    }

    case NodeActionTypes.UpdateNodeExpandedStateFailure: {
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
        ...state
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
      const { nodeId, descendants } = <{ descendants: DescendantsEntity[]; nodeId: string }>action.payload;
      const nodeIndex = state.entities.findIndex(n => n.id === nodeId);
      if (nodeIndex > -1) {
        const updatedNode = { ...state.entities[nodeIndex], descendants: descendants };
        const entities = [...state.entities];
        entities[nodeIndex] = updatedNode;
        if (state.selectedNode.id === nodeId) {
          return {
            ...state,
            entities,
            selectedNode: updatedNode
          };
        }
        return {
          ...state,
          entities
        };
      } else {
        return {
          ...state
        };
      }
    }

    case NodeActionTypes.UpdateNodeOwners: {
      const { nodeId, owners } = <{ owners: OwnersEntity[]; nodeId: string }>action.payload;
      const nodeIndex = state.entities.findIndex(n => n.id === nodeId);
      if (nodeIndex > -1) {
        return replaceNodeOwners(state, nodeIndex, nodeId, owners);
      } else {
        return {
          ...state
        };
      }
    }

    case WorkPackageNodeActionTypes.FindPotentialWorkpackageNodes: {
      return {
        ...state
      };
    }

    case WorkPackageNodeActionTypes.FindPotentialWorkpackageNodesSuccess: {
      return {
        ...state,
        descendants: action.payload
      };
    }

    case WorkPackageNodeActionTypes.FindPotentialWorkpackageNodesFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    default: {
      return state;
    }
  }
}

function replaceNodeOwners(state: State, nodeIndex: number, nodeId: string, owners: OwnersEntity[]): State {
  const updatedNode = { ...state.entities[nodeIndex], owners: owners };
  const entities = [...state.entities];
  entities[nodeIndex] = updatedNode;
  if (state.selectedNode.id === nodeId) {
    return {
      ...state,
      entities,
      selectedNode: updatedNode
    };
  }
  return {
    ...state,
    entities
  };
}

function replaceNodeLocation(state: State, nodeIndex: number, nodeId: string, layoutId, location): State {
  const updatedLocations = state.entities[nodeIndex].locations.concat();
  const locationIndex = updatedLocations.findIndex( function(loc) {return loc.layout.id === layoutId; });

  if (locationIndex > -1) {
    const updatedLocation = updatedLocations[locationIndex];
    updatedLocations.splice(locationIndex, 1, {...updatedLocation, locationCoordinates: location});
  }

  const updatedNode = { ...state.entities[nodeIndex], locations: updatedLocations};
  const entities = [...state.entities];
  entities[nodeIndex] = updatedNode;

  if (state.selectedNode.id === nodeId) {
    return {
      ...state,
      entities,
      selectedNode: updatedNode
    };
  }
  return {
    ...state,
    entities
  };
}

function replaceNodeExpandedState(state: State, nodeIndex: number, nodeId: string, layoutId, expandedState): State {
  const updatedExpandedStates = state.entities[nodeIndex].expandedStates.concat();
  const expandedStateIndex = updatedExpandedStates.findIndex( function(exp) {return exp.layout.id === layoutId; });

  if (expandedStateIndex > -1) {
    const updatedExpandedState = updatedExpandedStates[expandedStateIndex];
    updatedExpandedStates.splice(expandedStateIndex, 1,
      {...updatedExpandedState,
        middleExpanded: expandedState.middleExpanded,
        bottomExpanded: expandedState.bottomExpanded
      }
    );
  }

  const updatedNode = { ...state.entities[nodeIndex], expandedStates: updatedExpandedStates};
  const entities = [...state.entities];
  entities[nodeIndex] = updatedNode;

  if (state.selectedNode.id === nodeId) {
    return {
      ...state,
      entities,
      selectedNode: updatedNode
    };
  }
  return {
    ...state,
    entities
  };
}
