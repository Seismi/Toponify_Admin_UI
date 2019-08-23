import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum WorkPackageNodeActionTypes {
  AddWorkPackageNode = '[WorkPackage] Add node',
  AddWorkPackageNodeSuccess = '[WorkPackage] Add node success',
  AddWorkPackageNodeFailure = '[WorkPackage] Add node failure',
  LoadWorkPackageNodeDescendants = '[WorkPackage] Load node descendants',
  LoadWorkPackageNodeDescendantsSuccess = '[WorkPackage] Load node descendants success',
  LoadWorkPackageNodeDescendantsFailure = '[WorkPackage] Load node descendants failure',
  UpdateWorkPackageNode = '[WorkPackage] Update node',
  UpdateWorkPackageNodeSuccess = '[WorkPackage] Update node success',
  UpdateWorkPackageNodeFailure = '[WorkPackage] Update node failure',
  DeleteWorkpackageNode = '[WorkPackage] Delete Node',
  DeleteWorkpackageNodeSuccess = '[WorkPackage] Delete Node Success',
  DeleteWorkpackageNodeFailure = '[WorkPackage] Delete Node Fail',
}

export class AddWorkPackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNode;
  constructor(public payload: {workpackageId: string, node: any}) {}
}

export class AddWorkPackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeSuccess;
  constructor(public payload: any) {}
}

export class AddWorkPackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.AddWorkPackageNodeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNode;
  constructor(public payload: { workpackageId: string, nodeId: string, node: any }) { }
}

export class UpdateWorkPackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodeSuccess;
  constructor(public payload: any) { }
}

export class UpdateWorkPackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.UpdateWorkPackageNodeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export class LoadWorkPackageNodeDescendants implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendants;
  constructor(public payload: { workpackageId: string, nodeId: string }) { }
}

export class LoadWorkPackageNodeDescendantsSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsSuccess;
  constructor(public payload: any) { }
}

export class LoadWorkPackageNodeDescendantsFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsFailure;
  constructor(public payload: any) { }
}

export class DeleteWorkpackageNode implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNode;
  constructor(public payload: { workpackageId: string, nodeId: string }) { }
}

export class DeleteWorkpackageNodeSuccess implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeSuccess;
  constructor(public payload: any) { }
}

export class DeleteWorkpackageNodeFailure implements Action {
  readonly type = WorkPackageNodeActionTypes.DeleteWorkpackageNodeFailure;
  constructor(public payload: any) { }
}

export type WorkPackageNodeActionsUnion =
  | AddWorkPackageNode
  | AddWorkPackageNodeSuccess
  | AddWorkPackageNodeFailure
  | UpdateWorkPackageNode
  | UpdateWorkPackageNodeSuccess
  | UpdateWorkPackageNodeFailure
  | LoadWorkPackageNodeDescendants
  | LoadWorkPackageNodeDescendantsSuccess
  | LoadWorkPackageNodeDescendantsFailure
  | DeleteWorkpackageNode
  | DeleteWorkpackageNodeSuccess
  | DeleteWorkpackageNodeFailure;
