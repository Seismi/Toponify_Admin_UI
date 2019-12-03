import { Action } from '@ngrx/store';
import { Node, Error, NodeDetail } from '../models/node.model';
import { NodeLink, NodeLinkDetail } from '../models/node-link.model';

export enum NodeActionTypes {
  LoadNodes = '[Node] Load Nodes',
  LoadNodesSuccess = '[Node] Load Nodes Success',
  LoadNodesFailure = '[Node] Load Nodes Fail',
  LoadNodeLinks = '[Node] Load Node Links',
  LoadNodeLinksSuccess = '[Node] Load Node Links Success',
  LoadNodeLinksFailure = '[Node] Load Node Links Fail',
  LoadNodeUsageView = '[Node] Load Node Usage View',
  LoadNodeUsageViewSuccess = '[Node] Load Node Usage View Success',
  LoadNodeUsageViewFailure = '[Node] Load Node Usage View Fail',
  UpdateNodes = '[Node] Update nodes',
  UpdateNodesSuccess = '[Node] Update nodes Success',
  UpdateNodesFailure = '[Node] Update nodes Fail',
  UpdateLinks = '[Node] Update links',
  UpdateLinksSuccess = '[Node] Update links Success',
  UpdateLinksFailure = '[Node] Update links Fail'
}

export class LoadNodes implements Action {
  readonly type = NodeActionTypes.LoadNodes;
}

export class LoadNodesSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodesSuccess;
  constructor(public payload: Node[]) {}
}

export class LoadNodesFailure implements Action {
  readonly type = NodeActionTypes.LoadNodesFailure;
  constructor(public payload: Error) {}
}

export class LoadNodeUsageView implements Action {
  readonly type = NodeActionTypes.LoadNodeUsageView;
  constructor(public payload: string) {}
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
}

export class LoadNodeLinksSuccess implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksSuccess;
  constructor(public payload: NodeLink[]) {}
}

export class LoadNodeLinksFailure implements Action {
  readonly type = NodeActionTypes.LoadNodeLinksFailure;
  constructor(public payload: Error) {}
}

export class UpdateNodes implements Action {
  readonly type = NodeActionTypes.UpdateNodes;
  constructor(public payload: { layoutId: string; nodes: any[] }) {}
}

export class UpdateNodesSuccess implements Action {
  readonly type = NodeActionTypes.UpdateNodesSuccess;
  constructor(public payload: any) {}
}

export class UpdateNodesFailure implements Action {
  readonly type = NodeActionTypes.UpdateNodesFailure;
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

export type NodeActionsUnion =
  | LoadNodes
  | LoadNodesSuccess
  | LoadNodesFailure
  | LoadNodeLinks
  | LoadNodeLinksSuccess
  | LoadNodeLinksFailure
  | LoadNodeUsageView
  | LoadNodeUsageViewSuccess
  | LoadNodeUsageViewFailure
  | UpdateNodes
  | UpdateNodesSuccess
  | UpdateNodesFailure
  | UpdateLinks
  | UpdateLinksSuccess
  | UpdateLinksFailure;
