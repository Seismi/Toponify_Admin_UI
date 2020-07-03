import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';
import {LinkLayoutSettingsEntity, NodeLink, NodeLinkDetail, RoutesEntityEntity} from '../models/node-link.model';
import { NodeActionsUnion, NodeActionTypes, SetDraft } from '../actions/node.actions';
import {
  Error,
  ExpandedStatesEntity,
  LoadingStatus,
  LocationsEntityEntity,
  Node,
  NodeDetail,
  NodeReports,
  middleOptions,
  GroupAreaSizesEntity,
  OwnersEntity,
  Tag,
  NodeLayoutSettingsEntity, WorkPackageGroupMembersApiResponse, TagsHttpParams
} from '../models/node.model';
import { WorkpackageActionsUnion, WorkpackageActionTypes } from '../actions/workpackage.actions';
import { WorkPackageNodeActionsUnion, WorkPackageNodeActionTypes } from '@app/workpackage/store/actions/workpackage-node.actions';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { WorkPackageLinkActionsUnion, WorkPackageLinkActionTypes } from '@app/workpackage/store/actions/workpackage-link.actions';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';
import { Level } from '@app/architecture/services/diagram-level.service';
import { Page } from '@app/radio/store/models/radio.model';
import { TagListComponent } from '@app/architecture/components/tag-list/tag-list.component';

export interface State {
  reports: NodeReports[];
  zoomLevel: number;
  viewLevel: Level;
  draft: {
    [key: string]: any
  };
  entities: Node[];
  descendants: DescendantsEntity[];
  members: WorkPackageGroupMembersApiResponse['data'];
  selectedNode: NodeDetail;
  selectedNodeLink: NodeLinkDetail;
  links: NodeLink[];
  nodeScopes: WorkPackageNodeScopes[];
  availableScopes: WorkPackageNodeScopes[];
  error: Error;
  selectedWorkpackages: string[];
  parentNodeDescendantIds: string[];
  groupMemberIds: string[];
  availableTags: {
    tags: Tag[];
    id: string;
  };
  tags: {
    data: Tag[],
    page: TagsHttpParams
  };
  loadingLinks: LoadingStatus;
  loadingNodes: LoadingStatus;
  loadingNode: LoadingStatus;
  loadingLink: LoadingStatus;
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
  members: [],
  nodeScopes: [],
  availableScopes: [],
  error: null,
  selectedWorkpackages: [],
  parentNodeDescendantIds: [],
  groupMemberIds: [],
  availableTags: {
    tags: [],
    id: null
  },
  tags: {
    data: [],
    page: {
      textFilter: '',
      size: null,
      page: null
    }
  },
  loadingLinks: null,
  loadingNodes: null,
  draft: {},
  loadingNode: LoadingStatus.loaded,
  loadingLink: LoadingStatus.loaded
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
            return replaceLinkRoute(
              updatedState,
              linkIndex,
              link.id,
              layoutId,
              link.points,
              link.fromSpot,
              link.toSpot
            );
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

    case NodeActionTypes.UpdateTagFailure:
    case NodeActionTypes.DeleteTagFailure:
    case NodeActionTypes.LoadTagsFailure:
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

    case NodeActionTypes.LoadNodeLink: {
      return {
        ...state,
        loadingLink: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadNodeLinkSuccess: {
      return {
        ...state,
        selectedNodeLink: action.payload,
        loadingLink: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadNodeLinkFailure: {
      return {
        ...state,
        error: action.payload,
        loadingLink: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadNode: {
      return {
        ...state,
        loadingNode: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadNodeSuccess: {
      return {
        ...state,
        selectedNode: action.payload,
        loadingNode: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadNodeFailure: {
      return {
        ...state,
        loadingNode: LoadingStatus.error
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
        ...state
      };
    }

    case NodeActionTypes.LoadNodes: {
      return {
        ...state,
        loadingNodes: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadNodesSuccess: {
      return {
        ...state,
        entities: [...action.payload],
        loadingNodes: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadNodesFailure: {
      return {
        ...state,
        error: action.payload,
        loadingNodes: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadMapView: {
      return {
        ...state,
        loadingNodes: LoadingStatus.loading,
        loadingLinks: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadMapViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
        loadingNodes: LoadingStatus.loaded,
        loadingLinks: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadMapViewFailure: {
      return {
        ...state,
        error: action.payload,
        loadingNodes: LoadingStatus.error,
        loadingLinks: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadNodeUsageView: {
      return {
        ...state,
        loadingNodes: LoadingStatus.loading,
        loadingLinks: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadNodeUsageViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
        loadingNodes: LoadingStatus.loaded,
        loadingLinks: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadNodeUsageViewFailure: {
      return {
        ...state,
        error: action.payload,
        loadingNodes: LoadingStatus.error,
        loadingLinks: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadSourcesView: {
      return {
        ...state,
        loadingNodes: LoadingStatus.loading,
        loadingLinks: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadSourcesViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
        loadingNodes: LoadingStatus.loaded,
        loadingLinks: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadSourcesViewFailure: {
      return {
        ...state,
        error: action.payload,
        loadingNodes: LoadingStatus.error,
        loadingLinks: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadTargetsView: {
      return {
        ...state,
        loadingNodes: LoadingStatus.loading,
        loadingLinks: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadTargetsViewSuccess: {
      return {
        ...state,
        entities: [...action.payload.nodes],
        links: [...action.payload.links],
        loadingNodes: LoadingStatus.loaded,
        loadingLinks: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadTargetsViewFailure: {
      return {
        ...state,
        error: action.payload,
        loadingNodes: LoadingStatus.error,
        loadingLinks: LoadingStatus.error
      };
    }

    case NodeActionTypes.LoadNodeLinks: {
      return {
        ...state,
        loadingLinks: LoadingStatus.loading
      };
    }

    case NodeActionTypes.LoadNodeLinksSuccess: {
      return {
        ...state,
        links: [...action.payload],
        loadingLinks: LoadingStatus.loaded
      };
    }

    case NodeActionTypes.LoadNodeLinksFailure: {
      return {
        ...state,
        error: action.payload,
        loadingLinks: LoadingStatus.error
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

    case NodeActionTypes.SetDraft: {
      return {
        ...state,
        draft: {
          ...state.draft,
          [action.payload.layoutId]: action.payload
        }
      };
    }


    case NodeActionTypes.RemoveAllDraft: {
      return {
        ...state,
        draft: {}
      };
    }

    case NodeActionTypes.UpdatePartsLayoutSuccess: {
      const newDraft = { ...state.draft};
      delete newDraft[action.payload];
      return {
        ...state,
        draft: newDraft
      };
    }

    case NodeActionTypes.UpdateNodeLocations: {
      const { layoutId, nodes } = action.payload;
      return nodes.reduce(
        function(updatedState, node) {
          const nodeIndex = updatedState.entities.findIndex(n => n.id === node.id);
          if (nodeIndex > -1) {
            return replaceNodeLayoutSetting(
              updatedState,
              nodeIndex,
              node.id,
              layoutId,
              node.locationCoordinates,
              'locationCoordinates'
            );
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

        let updatedState = replaceNodeLayoutSetting(
          state,
          nodeIndex,
          data.id,
          layoutId,
          data.middleExpanded,
          'middleExpanded'
        );

        updatedState = replaceNodeLayoutSetting(
          updatedState,
          nodeIndex,
          data.id,
          layoutId,
          data.bottomExpanded,
          'bottomExpanded'
        );

        return updatedState;

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
            return replaceNodeLayoutSetting(
              updatedState,
              nodeIndex,
              group.id,
              layoutId,
              group.areaSize,
              'areaSize'
            );
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

    case WorkPackageNodeActionTypes.FindPotentialGroupMemberNodes: {
      return {
        ...state
      };
    }

    case WorkPackageNodeActionTypes.FindPotentialGroupMemberNodesSuccess: {
      return {
        ...state,
        members: action.payload
      };
    }

    case WorkPackageNodeActionTypes.FindPotentialGroupMemberNodesFailure: {
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

    case NodeActionTypes.GetParentDescendantIdsSuccess: {
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

    case NodeActionTypes.RemoveGroupMemberIds: {
      return {
        ...state,
        groupMemberIds: []
      };
    }

    case NodeActionTypes.SetGroupMemberIds: {
      return {
        ...state,
        groupMemberIds: getNestedMembers(state, action.payload).map((n) => n.id )
      };
    }

    case NodeActionTypes.GetGroupMemberIdsSuccess: {
      if (action.payload) {
        return {
          ...state,
          groupMemberIds: getNestedMembers(state, action.payload).map((n) => n.id )
        };
      } else {
        return {
          ...state,
          groupMemberIds: []
        };
      }
    }

    case NodeActionTypes.LoadAvailableTagsSuccess: {
      return {
        ...state,
        availableTags: action.payload
      };
    }

    case NodeActionTypes.LoadAvailableTags: {
      return {
        ...state,
        availableTags: {
          tags: [],
          id: null
        }
      };
    }

    case NodeActionTypes.AssociateTagSuccess:
    case NodeActionTypes.DissociateTagSuccess: {
      if (action.payload.type === 'node') {
        return {
          ...state,
          selectedNode: action.payload.nodeOrLinkDetail as NodeDetail
        };
      } else {
        return {
          ...state,
          selectedNodeLink: action.payload.nodeOrLinkDetail as NodeLinkDetail
        };
      }
    }

    case NodeActionTypes.LoadTagsSuccess: {
      return {
        ...state,
        tags: {
          data: action.payload.tags,
          page: action.payload.page
        }
      };
    }

    case NodeActionTypes.DeleteTagSuccess: {
      return {
        ...state,
        tags: {
          data: [...state.tags.data.filter(tag => tag.id !== action.payload.tagId)],
          page: state.tags.page
        }
      };
    }

    case NodeActionTypes.UpdateTagSuccess: {
      const index = state.tags.data.findIndex(tag => tag.id === action.payload.tag.id);
      const newTags = [...state.tags.data];
      newTags[index] = action.payload.tag;
      return {
        ...state,
        tags: {
          data: newTags,
          page: state.tags.page
        }
      };
    }

    case NodeActionTypes.CreateTagSuccess: {
      return {
        ...state,
        tags: {
          data: [...state.tags.data, action.payload.tag],
          page: state.tags.page
        }
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

function replaceNodeLayoutSetting(
  state: State,
  nodeIndex: number,
  nodeId: string,
  layoutId: string,
  newValue: any,
  setting: string
): State {
  const updatedLayouts: NodeLayoutSettingsEntity[] = state.entities[nodeIndex].positionPerLayout.concat();
  const layoutIndex: number = updatedLayouts.findIndex(function(layoutSettings: NodeLayoutSettingsEntity): boolean {
    return layoutSettings.layout.id === layoutId;
  });

  if (layoutIndex > -1) {
    const updatedLayout = updatedLayouts[layoutIndex];
    const newPositionSettings = { ...updatedLayout.layout.positionSettings, [setting]: newValue };
    const newLayout = { ...updatedLayout.layout, positionSettings: newPositionSettings };
    updatedLayouts.splice(layoutIndex, 1, { ...updatedLayout, layout: newLayout });
  }

  const updatedNode = { ...state.entities[nodeIndex], positionPerLayout: updatedLayouts };
  const entities = [...state.entities];
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

function replaceLinkRoute(state: State,
  linkIndex: number,
  linkId: string,
  layoutId: string,
  route: number[],
  fromSpot: string,
  toSpot: string
): State {
  const updatedLayouts: LinkLayoutSettingsEntity[] = state.links[linkIndex].positionPerLayout.concat();
  const layoutIndex: number = updatedLayouts.findIndex(function(layoutSettings: LinkLayoutSettingsEntity) {
    return layoutSettings.layout.id === layoutId;
  });

  if (layoutIndex > -1) {
    const updatedLayout = updatedLayouts[layoutIndex];
    const newPositionSettings = {
      ...updatedLayout.layout.positionSettings,
      route: route,
      fromSpot: fromSpot,
      toSpot: toSpot
    };
    const newLayout = { ...updatedLayout.layout, positionSettings: newPositionSettings };
    updatedLayouts.splice(layoutIndex, 1, { ...updatedLayout, layout: newLayout });
  }

  const updatedLink = { ...state.links[linkIndex], positionPerLayout: updatedLayouts };
  const links: NodeLink[] = [...state.links];
  links[linkIndex] = updatedLink;

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

// Get all nodes that are contained in a group node, including indirectly
function getNestedMembers(state: State, group: NodeDetail): Node[] {
  return state.entities.filter(function(node: Node): boolean {
    let currentGroup = node;

    // Loop through a node's sequence of containing groups
    do {

      // Check if node is a direct member of the provided group
      if (currentGroup.group === group.id) {
        return true;
      }

      // Consider the next group up in the sequence
      currentGroup = state.entities.find(item => item.id === currentGroup.group);
    } while (currentGroup);

    return false;
  });
}
