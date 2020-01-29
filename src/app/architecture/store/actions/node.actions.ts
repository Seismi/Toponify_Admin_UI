import { Action } from '@ngrx/store';
import {
  NodeExpandedStateApiRequest,
  Error,
  Node,
  NodeDetail,
  OwnersEntity,
  NodeReports,
  Tag
} from '../models/node.model';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { GetNodesRequestQueryParams } from '@app/architecture/services/node.service';

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
  UpdateNodeLocations = '[Node] Update node locations',
  UpdateNodeLocationsSuccess = '[Node] Update node locations Success',
  UpdateNodeLocationsFailure = '[Node] Update node locations Fail',
  UpdateNodeExpandedState = '[Node] Update node expanded state',
  UpdateNodeExpandedStateSuccess = '[Node] Update node expanded state Success',
  UpdateNodeExpandedStateFailure = '[Node] Update node expanded state Fail',
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
  LoadAvailableTags = '[Node] Load Available Tags',
  LoadAvailableTagsSuccess = '[Node] Load Available Tags Success',
  LoadAvailableTagsFailure = '[Node] Load Available Tags Fail'
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

export class LoadAvailableTags implements Action {
  readonly type = NodeActionTypes.LoadAvailableTags;
  constructor(public payload: { nodeId: string; workpackageId: string; type: 'link' | 'node' }) {}
}

export class LoadAvailableTagsSuccess implements Action {
  readonly type = NodeActionTypes.LoadAvailableTagsSuccess;
  constructor(public payload: {tags: Tag[], id: string}) {}
}

export class LoadAvailableTagsFailure implements Action {
  readonly type = NodeActionTypes.LoadAvailableTagsFailure;
  constructor(public payload: Error) {}
}

export type NodeActionsUnion =
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
  | UpdateNodeLocations
  | UpdateNodeLocationsSuccess
  | UpdateNodeLocationsFailure
  | UpdateNodeExpandedState
  | UpdateNodeExpandedStateSuccess
  | UpdateNodeExpandedStateFailure
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
  | LoadAvailableTags
  | LoadAvailableTagsSuccess
  | LoadAvailableTagsFailure;
