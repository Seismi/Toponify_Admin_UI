import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum WorkPackageNodeActionTypes {
  AddWorkPackageNode = '[WorkPackage] Add node',
  AddWorkPackageNodeSuccess = '[WorkPackage] Add node success',
  AddWorkPackageNodeFailure = '[WorkPackage] Add node failure',
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

export type WorkPackageNodeActionsUnion =
  | AddWorkPackageNode
  | AddWorkPackageNodeSuccess
  | AddWorkPackageNodeFailure;
