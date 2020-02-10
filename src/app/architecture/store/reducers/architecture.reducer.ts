import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';
import { NodeLink, NodeLinkDetail, RoutesEntityEntity } from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes } from '../actions/node.actions';
import {
  Error,
  ExpandedStatesEntity,
  LocationsEntityEntity,
  Node,
  NodeDetail,
  OwnersEntity,
  NodeReports,
  middleOptions,
  GroupAreaSizesEntity
} from '../models/node.model';
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
import { Level } from '@app/architecture/services/diagram-level.service';

export interface State {
  reports: NodeReports[];
  zoomLevel: number;
  viewLevel: Level;
  entities: Node[];
  descendants: DescendantsEntity[];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLinkDetail;
  links: NodeLink[];
  nodeScopes: WorkPackageNodeScopes[];
  availableScopes: WorkPackageNodeScopes[];
  error: Error;
  selectedWorkpackages: string[];
  parentNodeDescendantIds: string[];
}

export const initialState: State = {
  reports: [],
  zoomLevel: 3,
  viewLevel: Level.system,
  entities: [],
  selectedNode: null,
  selectedNodeLink: null,
  links: [],
  descendants: [],
  nodeScopes: [],
  availableScopes: [],
  error: null,
  selectedWorkpackages: [],
  parentNodeDescendantIds: []
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
          entity.id === action.payload.data.id ? (updatePart(entity, action.payload.data) as Node) : entity
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

    case NodeActionTypes.UpdateLinks: {
      const { layoutId, links } = action.payload;
      return links.reduce(
        function(updatedState, link) {
          const linkIndex = updatedState.links.findIndex(l => l.id === link.id);
          if (linkIndex > -1) {
            return replaceLinkRoute(updatedState, linkIndex, link.id, layoutId, link.points);
          }
        },
        {
          ...state
        }
      );
    }

    case WorkPackageLinkActionTypes.UpdateWorkPackageLinkSuccess: {
      return {
        ...state,
        links: state.links.map(link =>
          link.id === action.payload.data.id ? (updatePart(link, action.payload.data) as NodeLink) : link
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

    case WorkPackageNodeActionTypes.UpdateWorkPackageNodePropertySuccess:
    case WorkPackageNodeActionTypes.DeleteWorkPackageNodePropertySuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case WorkPackageNodeActionTypes.UpdateWorkPackageNodePropertyFailure:
    case WorkPackageNodeActionTypes.DeleteWorkPackageNodePropertyFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }

    case WorkPackageLinkActionTypes.UpdateWorkPackageLinkPropertySuccess:
    case WorkPackageLinkActionTypes.DeleteWorkPackageLinkPropertySuccess: {
      return {
        ...state,
        selectedNodeLink: action.payload
      };
    }

    case WorkPackageLinkActionTypes.UpdateWorkPackageLinkPropertyFailure:
    case WorkPackageLinkActionTypes.DeleteWorkPackageLinkPropertyFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }


    case WorkPackageNodeActionTypes.AddWorkPackageNodeRadioSuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }

    case WorkPackageNodeActionTypes.AddWorkPackageNodeRadioFailure: {
      return {
        ...state,
        error: <Error>action.payload
      };
    }


    case WorkPackageNodeActionTypes.DeleteWorkPackageNodeAttributeSuccess:
    case WorkPackageNodeActionTypes.AddWorkPackageNodeAttributeSuccess: {
      return {
        ...state,
        selectedNode: action.payload
      };
    }


    case WorkPackageLinkActionTypes.AddWorkPackageLinkRadioSuccess:
    case WorkPackageLinkActionTypes.DeleteWorkPackageLinkAttributeSuccess:
    case WorkPackageLinkActionTypes.AddWorkPackageLinkAttributeSuccess: {
      return {
        ...state,
        selectedNodeLink: action.payload
      };
    }


    case WorkPackageLinkActionTypes.AddWorkPackageLinkRadioFailure:
    case WorkPackageNodeActionTypes.DeleteWorkPackageNodeAttributeFailure:
    case WorkPackageNodeActionTypes.AddWorkPackageNodeAttributeFailure:
    case WorkPackageLinkActionTypes.DeleteWorkPackageLinkAttributeFailure:
    case WorkPackageLinkActionTypes.AddWorkPackageLinkAttributeFailure: {
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
      const nodeIndex = state.entities.findIndex(n => n.id === data.id);
      if (nodeIndex > -1) {
        return replaceNodeExpandedState(state, nodeIndex, data.id, layoutId, {
          middleExpanded: data.middleExpanded,
          bottomExpanded: data.bottomExpanded
        });
      } else {
        return {
          ...state
        };
      }
    }

    case NodeActionTypes.UpdateGroupAreaSize: {
      const { layoutId, data } = action.payload;
      return data.reduce(
        function(updatedState, group) {
          const nodeIndex = updatedState.entities.findIndex(g => g.id === group.id);
          if (nodeIndex > -1) {
            return replaceGroupAreaSize(state, nodeIndex, group.id, layoutId, group.areaSize);
          }
        }
        ,
        {
          ...state
        }
      );
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

    case NodeActionTypes.LoadNodeReports: {
      return {
        ...state
      };
    }

    case NodeActionTypes.LoadNodeReportsSuccess: {
      return {
        ...state,
        reports: action.payload
      };
    }

    case NodeActionTypes.LoadNodeReportsFailure: {
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

    case NodeActionTypes.RemoveParentDescendantIds: {
      return {
        ...state,
        parentNodeDescendantIds: []
      };
    }

    case NodeActionTypes.SetParentDescendantIds: {
      return {
        ...state,
        parentNodeDescendantIds: action.payload
      };
    }

    case NodeActionTypes.GetParentDescendantIdsSucces: {
      if (action.payload && action.payload.descendants) {
        return {
          ...state,
          parentNodeDescendantIds: action.payload.descendants.map(n => n.id)
        };
      } else {
        return {
          ...state,
          parentNodeDescendantIds: []
        };
      }
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

function replaceNodeLocation(
  state: State,
  nodeIndex: number,
  nodeId: string,
  layoutId: string,
  location: string
): State {
  const updatedLocations: LocationsEntityEntity[] = state.entities[nodeIndex].locations.concat();
  const locationIndex: number = updatedLocations.findIndex(function(loc: LocationsEntityEntity) {
    return loc.layout.id === layoutId;
  });

  if (locationIndex > -1) {
    const updatedLocation = updatedLocations[locationIndex];
    updatedLocations.splice(locationIndex, 1, { ...updatedLocation, locationCoordinates: location });
  }

  const updatedNode = { ...state.entities[nodeIndex], locations: updatedLocations };
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

function replaceNodeExpandedState(
  state: State,
  nodeIndex: number,
  nodeId: string,
  layoutId: string,
  expandedState: { middleExpanded: middleOptions; bottomExpanded: boolean }
): State {
  const updatedExpandedStates: ExpandedStatesEntity[] = state.entities[nodeIndex].expandedStates.concat();
  const expandedStateIndex: number = updatedExpandedStates.findIndex(function(exp: ExpandedStatesEntity) {
    return exp.layout.id === layoutId;
  });

  if (expandedStateIndex > -1) {
    const updatedExpandedState: ExpandedStatesEntity = updatedExpandedStates[expandedStateIndex];
    updatedExpandedStates.splice(expandedStateIndex, 1, {
      ...updatedExpandedState,
      middleExpanded: expandedState.middleExpanded,
      bottomExpanded: expandedState.bottomExpanded
    });
  }

  const updatedNode: Node = { ...state.entities[nodeIndex], expandedStates: updatedExpandedStates };
  const entities: Node[] = [...state.entities];
  entities[nodeIndex] = updatedNode;

  if (state.selectedNode && state.selectedNode.id === nodeId) {
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

function replaceGroupAreaSize(
  state: State,
  nodeIndex: number,
  nodeId: string,
  layoutId: string,
  areaSize: string
): State {
  const updatedGroupAreaSizes: GroupAreaSizesEntity[] = state.entities[nodeIndex].groupAreaSizes.concat();
  const areaSizeIndex: number = updatedGroupAreaSizes.findIndex(function(size: GroupAreaSizesEntity) {
    return size.layout.id === layoutId;
  });

  if (areaSizeIndex > -1) {
    const updatedGroupAreaSize = updatedGroupAreaSizes[areaSizeIndex];
    updatedGroupAreaSizes.splice(areaSizeIndex, 1, { ...updatedGroupAreaSize, areaSize: areaSize });
  }

  const updatedNode = { ...state.entities[nodeIndex], groupAreaSizes: updatedGroupAreaSizes };
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

function replaceLinkRoute(state: State, linkIndex: number, linkId: string, layoutId: string, route: number[]): State {
  const updatedLinkRoutes: RoutesEntityEntity[] = state.links[linkIndex].routes.concat();
  const LinkRouteIndex: number = updatedLinkRoutes.findIndex(function(path: RoutesEntityEntity) {
    return path.layout.id === layoutId;
  });

  if (LinkRouteIndex > -1) {
    const updatedLinkRoute: RoutesEntityEntity = updatedLinkRoutes[LinkRouteIndex];
    updatedLinkRoutes.splice(LinkRouteIndex, 1, { ...updatedLinkRoute, points: route });
  }

  const updatedLink: NodeLink = { ...state.links[linkIndex], routes: updatedLinkRoutes };
  const links: NodeLink[] = [...state.links];
  links[linkIndex] = updatedLink;

  if (state.selectedNodeLink && state.selectedNodeLink.id === linkId) {
    return {
      ...state,
      links,
      selectedNodeLink: { ...state.selectedNodeLink, routes: updatedLinkRoutes }
    };
  }
  return {
    ...state,
    links
  };
}

function updatePart(oldPartData: NodeLink | Node, newPartData: NodeDetail | NodeLinkDetail): Node | NodeLink {
  const updatedPart: Node | NodeLink = { ...oldPartData };

  // Ensure no extraneous properties added to part data by only updating
  //  properties that exist in the previous state data for the part
  Object.keys(newPartData).forEach(function(field: string): void {
    if (field in oldPartData) {
      updatedPart[field] = newPartData[field];
    }
  });

  // Update source and target details for links - cannot copy these details directly as
  //  the format for these is different for NodeLink and NodeLinkDetail objects
  if ('sourceObject' in newPartData && 'sourceId' in updatedPart) {
    updatedPart.sourceId = newPartData.sourceObject.id;
    updatedPart.sourceName = newPartData.sourceObject.name;
    updatedPart.targetId = newPartData.targetObject.id;
    updatedPart.targetName = newPartData.targetObject.name;
  }

  return updatedPart;
}
