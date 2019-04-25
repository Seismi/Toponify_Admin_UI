import { NodeType } from '@app/version/services/diagram-node.service';
import { Action } from '@ngrx/store';

export enum VersionNodeActionTypes {
  LoadNodeDescendants = '[Node] Load Node descendants',
  LoadNodeDescendantsSuccess = '[Node] Load Node descendants success',
  LoadNodeDescendantsFailure = '[Node] Load Node descendants failure',
  DeleteNode = '[Node] Delete Node',
  DeleteNodeSuccess = '[Node] Delete Node Success',
  DeleteNodeFailure = '[Node] Delete Node Fail',
}

export class LoadNodeDescendants implements Action {
  readonly type = VersionNodeActionTypes.LoadNodeDescendants;
  constructor(public payload: {versionId: string, nodeId: string, nodeType: NodeType}) {}
}

export class LoadNodeDescendantsSuccess implements Action {
  readonly type = VersionNodeActionTypes.LoadNodeDescendantsSuccess;
  constructor(public payload: any) {}
}

export class LoadNodeDescendantsFailure implements Action {
  readonly type = VersionNodeActionTypes.LoadNodeDescendantsFailure;
  constructor(public payload: any) {}
}

export class DeleteNode implements Action {
  readonly type = VersionNodeActionTypes.DeleteNode;
  constructor(public payload: {versionId: string, nodeId: string, nodeType: NodeType}) {}
}

export class DeleteNodeSuccess implements Action {
  readonly type = VersionNodeActionTypes.DeleteNodeSuccess;
  constructor(public payload: any) {}
}

export class DeleteNodeFailure implements Action {
  readonly type = VersionNodeActionTypes.DeleteNodeFailure;
  constructor(public payload: any) {}
}

export type VersionActionsUnion =
  | LoadNodeDescendants
  | LoadNodeDescendantsSuccess
  | LoadNodeDescendantsFailure
  | DeleteNode
  | DeleteNodeSuccess
  | DeleteNodeFailure;
