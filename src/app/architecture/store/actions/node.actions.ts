import { Action } from '@ngrx/store';
import {
  NodeExpandedStateApiRequest,
  Error,
  Node,
  NodeDetail,
  OwnersEntity,
  NodeReports,
  GroupAreaSizeApiRequest,
  Tag,
  TagsHttpParams
} from '../models/node.model';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { GetNodesRequestQueryParams } from '@app/architecture/services/node.service';
import {colourOptions, UpdateDiagramLayoutApiRequest} from '@app/architecture/store/models/layout.model';

export enum NodeActionTypes {
  LoadNodes = '[Node] Load Nodes',
  LoadNodesSuccess = '[Node] Load Nodes Success',
  LoadNodesFailure = '[Node] Load Nodes Fail',
  LoadNode = '[Node] Load Node',
  LoadNodeSuccess = '[Node] Load Node Success',
  LoadNodeFailure = '[Node] Load Node Fail',
  LoadNodeLinks = '[Node] Load Node Links',
  LoadNodeLinksSuccess = '[Node] Load Node Links Success',
  LoadNodeLinksFailure = '[Node] Load Node Links Fail',
  LoadNodeLink = '[Node] Load Node Link',
  LoadNodeLinkSuccess = '[Node] Load Node Link Success',
  LoadNodeLinkFailure = '[Node] Load Node Link Fail',
  LoadMapView = '[Node] Load Map View',
  LoadMapViewSuccess = '[Node] Load Map View Success',
  LoadMapViewFailure = '[Node] Load Map View Fail',
  LoadNodeUsageView = '[Node] Load Node Usage View',
  LoadNodeUsageViewSuccess = '[Node] Load Node Usage View Success',
  LoadNodeUsageViewFailure = '[Node] Load Node Usage View Fail',
  LoadSourcesView = '[Node] Load Node Sources View',
  LoadSourcesViewSuccess = '[Node] Load Node Sources View Success',
  LoadSourcesViewFailure = '[Node] Load Node Sources View Fail',
  LoadTargetsView = '[Node] Load Node Targets View',
  LoadTargetsViewSuccess = '[Node] Load Node Targets View Success',
  LoadTargetsViewFailure = '[Node] Load Node Targets View Fail',
  UpdateNodeLocations = '[Node] Update node locations',
  UpdateNodeLocationsSuccess = '[Node] Update node locations Success',
  UpdateNodeLocationsFailure = '[Node] Update node locations Fail',
  UpdatePartsLayout = '[Node] update layout for nodes and links',
  UpdatePartsLayoutSuccess = '[Node] update layout for nodes and links Success',
  UpdatePartsLayoutFailure = '[Node] update layout for nodes and links Fail',
  UpdateNodeExpandedState = '[Node] Update node expanded state',
  UpdateNodeExpandedStateSuccess = '[Node] Update node expanded state Success',
  UpdateNodeExpandedStateFailure = '[Node] Update node expanded state Fail',
  UpdateGroupAreaSize = '[Node] Update group area size',
  UpdateGroupAreaSizeSuccess = '[Node] Update group area size Success',
  UpdateGroupAreaSizeFailure = '[Node] Update group area size Fail',
  UpdateNodeColour = '[Node] Update node colour',
  UpdateNodeColourSuccess = '[Node] Update node colour Success',
  UpdateNodeColourFailure = '[Node] Update node colour Fail',
  UpdateNodeLabelState = '[Node] Update node label state',
  UpdateNodeLabelStateSuccess = '[Node] Update node label state Success',
  UpdateNodeLabelStateFailure = '[Node] Update node label state Fail',
  UpdateLinks = '[Node] Update links',
  UpdateLinksSuccess = '[Node] Update links Success',
  UpdateLinksFailure = '[Node] Update links Fail',
  UpdateNodeDescendants = '[Node] Update Node Descendants',
  UpdateNodeOwners = '[Node] Update Node Owners',
  DeleteCustomProperty = '[Node] Delete Custom Property',
  DeleteCustomPropertySuccess = '[Node] Delete Custom Property Success',
  DeleteCustomPropertyFailure = '[Node] Delete Custom Property Failure',
  LoadNodeReports = '[Node] Load Node Reports',
  LoadNodeReportsSuccess = '[Node] Load Node Reports Success',
  LoadNodeReportsFailure = '[Node] Load Node Reports Fail',
  RemoveParentDescendantIds = '[Node] Remove Parent Descendant Ids',
  GetParentDescendantIds = '[Node] Get Parent Descendant Ids',
  GetParentDescendantIdsSuccess = '[Node] Get Parent Descendant Ids Success',
  GetParentDescendantIdsFailure = '[Node] Get Parent Descendant Ids Failure',
  SetParentDescendantIds = '[Node] Set Parent Descendant Ids',
  RemoveGroupMemberIds = '[Node] Remove Group Member Ids',
  GetGroupMemberIds = '[Node] Get Group Member Ids',
  GetGroupMemberIdsSuccess = '[Node] Get Group Member Ids Success',
  GetGroupMemberIdsFailure = '[Node] Get Group Member Ids Failure',
  SetGroupMemberIds = '[Node] Set Group Member Ids',
  LoadAvailableTags = '[Node] Load Available Tags',
  LoadAvailableTagsSuccess = '[Node] Load Available Tags Success',
  LoadAvailableTagsFailure = '[Node] Load Available Tags Fail',
  CreateTag = '[Node] Create Tag',
  CreateTagSuccess = '[Node] Create Tag Success',
  CreateTagFailure = '[Node] Create Tag Fail',
  AssociateTag = '[Node] Associate Tag',
  AssociateTagSuccess = '[Node] Associate Tag Success',
  AssociateTagFailure = '[Node] Associate Tag Fail',
  LoadTags = '[Node] Load Tags',
  LoadTagsSuccess = '[Node] Load Tags Success',
  LoadTagsFailure = '[Node] Load Tags Fail',
  UpdateTag = '[Node] Update Tag',
  UpdateTagSuccess = '[Node] Update Tag Success',
  UpdateTagFailure = '[Node] Update Tag Fail',
  DeleteTag = '[Node] Delete Tag',
  DeleteTagSuccess = '[Node] Delete Tag Success',
  DeleteTagFailure = '[Node] Delete Tag Fail',
  DissociateTag = '[Node] Dissociate Tag',
  DissociateTagSuccess = '[Node] Dissociate Tag Success',
  DissociateTagFailure = '[Node] Dissociate Tag Fail',
  ReloadNodesData = '[Node] Reload Nodes Data',
  SetDraft = '[Node] Set draft',
  RemoveAllDraft = '[Node] Remove all draft',
  UndoLayoutChange = '[Node] Undo layout change',
  UpdateNodeGroupMembers = '[Node] Update Node Group Members',
  UpdateNodeGroupMembersSuccess = '[Node] Update Node Group Members Success',
  UpdateNodeGroupMembersFailure = '[Node] Update Node Group Members Failure',
  UpdateNodeChildren = '[Node] Update Node Children',
  UpdateNodeChildrenSuccess = '[Node] Update Node Children Success',
  UpdateNodeChildrenFailure = '[Node] Update Node Children Failure',

}

export class SetDraft implements Action {
  readonly type = NodeActionTypes.SetDraft;
  constructor(public payload: { layoutId: string; data: any}) {}
}

export class RemoveAllDraft implements Action {
  readonly type = NodeActionTypes.RemoveAllDraft;
  constructor() {}
}

export class UndoLayoutChange implements Action {
  readonly type = NodeActionTypes.UndoLayoutChange;
  constructor() {}
}

export class LoadNodes implements Action {
  readonly type = NodeActionTypes.LoadNodes;
  constructor(public payload?: GetNodesRequestQueryParams) {}
}

export class LoadNodesSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodesSuccess;
  constructor(public payload: Node[]) {}
}

export class LoadNodesFailure implements Action {
  readonly type = NodeActionTypes.LoadNodesFailure;
  constructor(public payload: Error) {}
}

export class LoadNode implements Action {
  readonly type = NodeActionTypes.LoadNode;
  constructor(public payload: { id: string; queryParams?: any }) {}
}

export class LoadNodeSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeSuccess;
  constructor(public payload: NodeDetail) {}
}

export class LoadNodeFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeFailure;
  constructor(public payload: Error) {}
}

export class LoadMapView implements Action {
  readonly type = NodeActionTypes.LoadMapView;
  constructor(public payload: { id: string; queryParams: GetNodesRequestQueryParams }) {}
}

export class LoadMapViewSuccess implements Action {
  readonly type = NodeActionTypes.LoadMapViewSuccess;
  constructor(public payload: any) {}
}

export class LoadMapViewFailure implements Action {
  readonly type = NodeActionTypes.LoadMapViewFailure;
  constructor(public payload: Error) {}
}

export class LoadNodeUsageView implements Action {
  readonly type = NodeActionTypes.LoadNodeUsageView;
  constructor(public payload: { node: string; query: { workPackageQuery: string[] } }) {}
}

export class LoadNodeUsageViewSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeUsageViewSuccess;
  constructor(public payload: any) {}
}

export class LoadNodeUsageViewFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeUsageViewFailure;
  constructor(public payload: Error) {}
}

export class LoadSourcesView implements Action {
  readonly type = NodeActionTypes.LoadSourcesView;
  constructor(public payload: { node: string; query: { workPackageQuery: string[] } }) {}
}

export class LoadSourcesViewSuccess implements Action {
  readonly type = NodeActionTypes.LoadSourcesViewSuccess;
  constructor(public payload: any) {}
}

export class LoadSourcesViewFailure implements Action {
  readonly type = NodeActionTypes.LoadSourcesViewFailure;
  constructor(public payload: Error) {}
}

export class LoadTargetsView implements Action {
  readonly type = NodeActionTypes.LoadTargetsView;
  constructor(public payload: { node: string; query: { workPackageQuery: string[] } }) {}
}

export class LoadTargetsViewSuccess implements Action {
  readonly type = NodeActionTypes.LoadTargetsViewSuccess;
  constructor(public payload: any) {}
}

export class LoadTargetsViewFailure implements Action {
  readonly type = NodeActionTypes.LoadTargetsViewFailure;
  constructor(public payload: Error) {}
}

export class LoadNodeLinks implements Action {
  readonly type = NodeActionTypes.LoadNodeLinks;
  constructor(public payload?: any) {}
}

export class LoadNodeLinksSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksSuccess;
  constructor(public payload: NodeLink[]) {}
}

export class LoadNodeLinksFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksFailure;
  constructor(public payload: Error) {}
}

export class LoadNodeLink implements Action {
  readonly type = NodeActionTypes.LoadNodeLink;
  constructor(public payload: { id: string; queryParams?: any }) {}
}

export class LoadNodeLinkSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeLinkSuccess;
  constructor(public payload: NodeLinkDetail) {}
}

export class LoadNodeLinkFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeLinkFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeLocations implements Action {
  readonly type = NodeActionTypes.UpdateNodeLocations;
  constructor(public payload: { layoutId: string; nodes: any[] }) {}
}

export class UpdateNodeLocationsSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeLocationsSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeLocationsFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeLocationsFailure;
  constructor(public payload: Error) {}
}

export class UpdatePartsLayout implements Action {
  readonly type = NodeActionTypes.UpdatePartsLayout;
  constructor(public payload: { layoutId: string; data: UpdateDiagramLayoutApiRequest['data']; draft: boolean }) {}
}

export class UpdatePartsLayoutSuccess implements Action {
  readonly type = NodeActionTypes.UpdatePartsLayoutSuccess;
  constructor(public payload: any) {}
}

export class UpdatePartsLayoutFailure implements Action {
  readonly type = NodeActionTypes.UpdatePartsLayoutFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeExpandedState implements Action {
  readonly type = NodeActionTypes.UpdateNodeExpandedState;
  constructor(public payload: { layoutId: string; data: NodeExpandedStateApiRequest['data'] }) {}
}

export class UpdateNodeExpandedStateSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeExpandedStateSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeExpandedStateFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeExpandedStateFailure;
  constructor(public payload: Error) {}
}

export class UpdateGroupAreaSize implements Action {
  readonly type = NodeActionTypes.UpdateGroupAreaSize;
  constructor(public payload: { layoutId: string; data: GroupAreaSizeApiRequest['data'] }) {}
}

export class UpdateGroupAreaSizeSuccess implements Action {
  readonly type = NodeActionTypes.UpdateGroupAreaSizeSuccess;
  constructor(public payload: any) {}
}

export class UpdateGroupAreaSizeFailure implements Action {
  readonly type = NodeActionTypes.UpdateGroupAreaSizeFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeColour implements Action {
  readonly type = NodeActionTypes.UpdateNodeColour;
  constructor(public payload: { layoutId: string; data: {id: string; colour: colourOptions; }}) {}
}

export class UpdateNodeColourSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeColourSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeColourFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeColourFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeLabelState implements Action {
  readonly type = NodeActionTypes.UpdateNodeLabelState;
  constructor(public payload: { layoutId: string; data: {id: string; showLabel: boolean; }}) {}
}

export class UpdateNodeLabelStateSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeLabelStateSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeLabelStateFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeLabelStateFailure;
  constructor(public payload: Error) {}
}

export class UpdateLinks implements Action {
  readonly type = NodeActionTypes.UpdateLinks;
  constructor(public payload: { layoutId: string; links: any[] }) {}
}

export class UpdateLinksSuccess implements Action {
  readonly type = NodeActionTypes.UpdateLinksSuccess;
  constructor(public payload: any) {}
}

export class UpdateLinksFailure implements Action {
  readonly type = NodeActionTypes.UpdateLinksFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeDescendants implements Action {
  readonly type = NodeActionTypes.UpdateNodeDescendants;
  constructor(public payload: { descendants: DescendantsEntity[]; nodeId: string }) {}
}

export class UpdateNodeOwners implements Action {
  readonly type = NodeActionTypes.UpdateNodeOwners;
  constructor(public payload: { owners: OwnersEntity[]; nodeId: string }) {}
}

export class DeleteCustomProperty implements Action {
  readonly type = NodeActionTypes.DeleteCustomProperty;
  constructor(public payload: { workPackageId: string; nodeId: string; customPropertyId: string }) {}
}

export class DeleteCustomPropertySuccess implements Action {
  readonly type = NodeActionTypes.DeleteCustomPropertySuccess;
  constructor(public payload: Node) {}
}

export class DeleteCustomPropertyFailure implements Action {
  readonly type = NodeActionTypes.DeleteCustomPropertyFailure;
  constructor(public payload: Error) {}
}

export class LoadNodeReports implements Action {
  readonly type = NodeActionTypes.LoadNodeReports;
  constructor(public payload: { nodeId: string; queryParams?: GetNodesRequestQueryParams }) {}
}

export class LoadNodeReportsSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeReportsSuccess;
  constructor(public payload: NodeReports[]) {}
}

export class LoadNodeReportsFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeReportsFailure;
  constructor(public payload: Error) {}
}

export class RemoveParentDescendantIds implements Action {
  readonly type = NodeActionTypes.RemoveParentDescendantIds;
}

export class GetParentDescendantIds implements Action {
  readonly type = NodeActionTypes.GetParentDescendantIds;
  constructor(public payload: { id: string; workpackages: string[] }) {}
}

export class GetParentDescendantIdsSuccess implements Action {
  readonly type = NodeActionTypes.GetParentDescendantIdsSuccess;
  constructor(public payload: NodeDetail) {}
}

export class GetParentDescendantIdsFailure implements Action {
  readonly type = NodeActionTypes.GetParentDescendantIdsFailure;
  constructor(public payload: Error) {}
}

export class SetParentDescendantIds implements Action {
  readonly type = NodeActionTypes.SetParentDescendantIds;
  constructor(public payload: string[]) {}
}

export class RemoveGroupMemberIds implements Action {
  readonly type = NodeActionTypes.RemoveGroupMemberIds;
}

export class GetGroupMemberIds implements Action {
  readonly type = NodeActionTypes.GetGroupMemberIds;
  constructor(public payload: { id: string; workpackages: string[] }) {}
}

export class GetGroupMemberIdsSuccess implements Action {
  readonly type = NodeActionTypes.GetGroupMemberIdsSuccess;
  constructor(public payload: NodeDetail) {}
}

export class GetGroupMemberIdsFailure implements Action {
  readonly type = NodeActionTypes.GetGroupMemberIdsFailure;
  constructor(public payload: Error) {}
}

export class SetGroupMemberIds implements Action {
  readonly type = NodeActionTypes.SetGroupMemberIds;
  constructor(public payload: NodeDetail) {}
}

export class LoadAvailableTags implements Action {
  readonly type = NodeActionTypes.LoadAvailableTags;
  constructor(public payload: { nodeId: string; workpackageId: string; type: 'link' | 'node' }) {}
}

export class LoadAvailableTagsSuccess implements Action {
  readonly type = NodeActionTypes.LoadAvailableTagsSuccess;
  constructor(public payload: { tags: Tag[]; id: string }) {}
}

export class LoadAvailableTagsFailure implements Action {
  readonly type = NodeActionTypes.LoadAvailableTagsFailure;
  constructor(public payload: Error) {}
}

export class CreateTag implements Action {
  readonly type = NodeActionTypes.CreateTag;
  constructor(public payload: { tag: Tag; associateWithNode?: {workpackageId: string; type: 'link' | 'node'; nodeOrLinkId: string }}) {}
}

export class CreateTagSuccess implements Action {
  readonly type = NodeActionTypes.CreateTagSuccess;
  constructor(public payload: { tag: Tag }) {}
}

export class CreateTagFailure implements Action {
  readonly type = NodeActionTypes.CreateTagFailure;
  constructor(public payload: Error) {}
}

export class AssociateTag implements Action {
  readonly type = NodeActionTypes.AssociateTag;
  constructor(
    public payload: { tagIds: [{ id: string }]; workpackageId: string; nodeOrLinkId: string; type: 'link' | 'node' }
  ) {}
}

export class AssociateTagSuccess implements Action {
  readonly type = NodeActionTypes.AssociateTagSuccess;
  constructor(public payload: { nodeOrLinkDetail: NodeDetail | NodeLinkDetail; type: 'link' | 'node' }) {}
}

export class AssociateTagFailure implements Action {
  readonly type = NodeActionTypes.AssociateTagFailure;
  constructor(public payload: Error) {}
}

export class DissociateTag implements Action {
  readonly type = NodeActionTypes.DissociateTag;
  constructor(public payload: { tag: Tag; workpackageId: string; nodeOrLinkId: string; type: 'link' | 'node' }) {}
}

export class DissociateTagSuccess implements Action {
  readonly type = NodeActionTypes.DissociateTagSuccess;
  constructor(public payload: { nodeOrLinkDetail: NodeDetail | NodeLinkDetail; type: 'link' | 'node' }) {}
}

export class DissociateTagFailure implements Action {
  readonly type = NodeActionTypes.DissociateTagFailure;
  constructor(public payload: Error) {}
}

export class LoadTags implements Action {
  readonly type = NodeActionTypes.LoadTags;
  constructor(public payload: TagsHttpParams) {}
}

export class LoadTagsSuccess implements Action {
  readonly type = NodeActionTypes.LoadTagsSuccess;
  constructor(public payload: { tags: Tag[], page: TagsHttpParams }) {}
}

export class LoadTagsFailure implements Action {
  readonly type = NodeActionTypes.LoadTagsFailure;
  constructor(public payload: Error) {}
}

export class UpdateTag implements Action {
  readonly type = NodeActionTypes.UpdateTag;
  constructor(public payload: { tag: Tag }) {}
}

export class UpdateTagSuccess implements Action {
  readonly type = NodeActionTypes.UpdateTagSuccess;
  constructor(public payload: { tag: Tag }) {}
}

export class UpdateTagFailure implements Action {
  readonly type = NodeActionTypes.UpdateTagFailure;
  constructor(public payload: Error) {}
}

export class DeleteTag implements Action {
  readonly type = NodeActionTypes.DeleteTag;
  constructor(public payload: { tagId: string }) {}
}

export class DeleteTagSuccess implements Action {
  readonly type = NodeActionTypes.DeleteTagSuccess;
  constructor(public payload: { tagId: string }) {}
}

export class DeleteTagFailure implements Action {
  readonly type = NodeActionTypes.DeleteTagFailure;
  constructor(public payload: Error) {}
}

export class ReloadNodesData implements Action {
  readonly type = NodeActionTypes.ReloadNodesData;
}

export class UpdateNodeGroupMembers implements Action {
  readonly type = NodeActionTypes.UpdateNodeGroupMembers;
  constructor(public payload: any) {}
}

export class UpdateNodeGroupMembersSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeGroupMembersSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeGroupMembersFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeGroupMembersFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodeChildren implements Action {
  readonly type = NodeActionTypes.UpdateNodeChildren;
  constructor(public payload: any) {}
}

export class UpdateNodeChildrenSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeChildrenSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodeChildrenFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeChildrenFailure;
  constructor(public payload: Error) {}
}

export type NodeActionsUnion =
  | SetDraft
  | RemoveAllDraft
  | UndoLayoutChange
  | LoadNodes
  | LoadNodesSuccess
  | LoadNodesFailure
  | LoadNode
  | LoadNodeSuccess
  | LoadNodeFailure
  | LoadNodeLinks
  | LoadNodeLinksSuccess
  | LoadNodeLinksFailure
  | LoadNodeLink
  | LoadNodeLinkSuccess
  | LoadNodeLinkFailure
  | LoadMapView
  | LoadMapViewSuccess
  | LoadMapViewFailure
  | LoadNodeUsageView
  | LoadNodeUsageViewSuccess
  | LoadNodeUsageViewFailure
  | LoadSourcesView
  | LoadSourcesViewSuccess
  | LoadSourcesViewFailure
  | LoadTargetsView
  | LoadTargetsViewSuccess
  | LoadTargetsViewFailure
  | UpdateNodeLocations
  | UpdateNodeLocationsSuccess
  | UpdateNodeLocationsFailure
  | UpdatePartsLayout
  | UpdatePartsLayoutSuccess
  | UpdatePartsLayoutFailure
  | UpdateNodeExpandedState
  | UpdateNodeExpandedStateSuccess
  | UpdateNodeExpandedStateFailure
  | UpdateGroupAreaSize
  | UpdateGroupAreaSizeSuccess
  | UpdateGroupAreaSizeFailure
  | UpdateNodeColour
  | UpdateNodeColourSuccess
  | UpdateNodeColourFailure
  | UpdateNodeLabelState
  | UpdateNodeLabelStateSuccess
  | UpdateNodeLabelStateFailure
  | UpdateLinks
  | UpdateLinksSuccess
  | UpdateLinksFailure
  | UpdateNodeDescendants
  | UpdateNodeOwners
  | DeleteCustomProperty
  | DeleteCustomPropertySuccess
  | DeleteCustomPropertyFailure
  | LoadNodeReports
  | LoadNodeReportsSuccess
  | LoadNodeReportsFailure
  | RemoveParentDescendantIds
  | GetParentDescendantIds
  | GetParentDescendantIdsSuccess
  | GetParentDescendantIdsFailure
  | SetParentDescendantIds
  | RemoveGroupMemberIds
  | GetGroupMemberIds
  | GetGroupMemberIdsSuccess
  | GetGroupMemberIdsFailure
  | SetGroupMemberIds
  | LoadAvailableTags
  | LoadAvailableTagsSuccess
  | LoadAvailableTagsFailure
  | CreateTag
  | CreateTagSuccess
  | CreateTagFailure
  | AssociateTag
  | AssociateTagSuccess
  | AssociateTagFailure
  | DissociateTag
  | DissociateTagSuccess
  | DissociateTagFailure
  | LoadTags
  | LoadTagsSuccess
  | LoadTagsFailure
  | UpdateTag
  | UpdateTagSuccess
  | UpdateTagFailure
  | DeleteTag
  | DeleteTagSuccess
  | DeleteTagFailure
  | ReloadNodesData
  | UpdateNodeGroupMembers
  | UpdateNodeGroupMembersSuccess
  | UpdateNodeGroupMembersFailure
  | UpdateNodeChildren
  | UpdateNodeChildrenSuccess
  | UpdateNodeChildrenFailure;
