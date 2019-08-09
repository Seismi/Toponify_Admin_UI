
import { Action } from '@ngrx/store';
import { Node, Error, NodeDetail } from '../models/node.model';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';

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
  LoadNodeLink= '[Node] Load Node Link',
  LoadNodeLinkSuccess = '[Node] Load Node Link Success',
  LoadNodeLinkFailure = '[Node] Load Node Link Fail',
  LoadMapView = '[Node] Load Map View',
  LoadMapViewSuccess = '[Node] Load Map View Success',
  LoadMapViewFailure = '[Node] Load Map View Fail',
  UpdateNode = '[Node] Update node',
  UpdateNodeSuccess = '[Node] Update node Success',
  UpdateNodeFailure = '[Node] Update node Fail',
  UpdateLinks = '[Node] Update links',
  UpdateLinksSuccess = '[Node] Update links Success',
  UpdateLinksFailure = '[Node] Update links Fail',
}

export class LoadNodes implements Action {
  readonly type = NodeActionTypes.LoadNodes;
  constructor(public payload?: any) { }
}

export class LoadNodesSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodesSuccess;
  constructor(public payload: Node[]) { }
}

export class LoadNodesFailure implements Action {
  readonly type = NodeActionTypes.LoadNodesFailure;
  constructor(public payload: Error) { }
}

export class LoadNode implements Action {
  readonly type = NodeActionTypes.LoadNode;
  constructor(public payload: string) { }
}

export class LoadMapView implements Action {
  readonly type = NodeActionTypes.LoadMapView;
  constructor(public payload: string) { }
}

export class LoadMapViewSuccess implements Action {
  readonly type = NodeActionTypes.LoadMapViewSuccess;
  constructor(public payload: any) { }
}

export class LoadMapViewFailure implements Action {
  readonly type = NodeActionTypes.LoadMapViewFailure;
  constructor(public payload: Error) { }
}

export class LoadNodeSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeSuccess;
  constructor(public payload: NodeDetail) { }
}

export class LoadNodeFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeFailure;
  constructor(public payload: Error) { }
}

export class LoadNodeLinks implements Action {
  readonly type = NodeActionTypes.LoadNodeLinks;
  constructor(public payload?: any) { }
}

export class LoadNodeLinksSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksSuccess;
  constructor(public payload: NodeLink[]) { }
}

export class LoadNodeLinksFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksFailure;
  constructor(public payload: Error) { }
}

export class LoadNodeLink implements Action {
  readonly type = NodeActionTypes.LoadNodeLink;
  constructor(public payload: string) { }
}

export class LoadNodeLinkSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeLinkSuccess;
  constructor(public payload: NodeLinkDetail) { }
}

export class LoadNodeLinkFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeLinkFailure;
  constructor(public payload: Error) { }
}

export class UpdateNode implements Action {
  readonly type = NodeActionTypes.UpdateNode;
  constructor(public payload: {layoutId: string, node: any}) { }
}

export class UpdateNodeSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodeSuccess;
  constructor(public payload: any) { }
}

export class UpdateNodeFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodeFailure;
  constructor(public payload: Error) { }
}

export class UpdateLinks implements Action {
  readonly type = NodeActionTypes.UpdateLinks;
  constructor(public payload: {layoutId: string, links: any[]}) { }
}

export class UpdateLinksSuccess implements Action {
  readonly type = NodeActionTypes.UpdateLinksSuccess;
  constructor(public payload: any) { }
}

export class UpdateLinksFailure implements Action {
  readonly type = NodeActionTypes.UpdateLinksFailure;
  constructor(public payload: Error) { }
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
  | UpdateNode
  | UpdateNodeSuccess
  | UpdateNodeFailure
  | UpdateLinks
  | UpdateLinksSuccess
  | UpdateLinksFailure
  ;

