import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse, WorkPackageDetail, WorkPackageApiRequest, WorkPackageEntity, OwnersEntityOrApproversEntity, WorkPackageApiResponse } from '../models/workpackage.models';

export enum WorkPackageActionTypes {
  LoadWorkPackages = '[WorkPackage] Load WorkPackage entities',
  LoadWorkPackagesSuccess = '[WorkPackage] Load WorkPackage entities success',
  LoadWorkPackagesFailure = '[WorkPackage] Load WorkPackage entities failure',

  LoadWorkPackage = '[WorkPackage] Load WorkPackage',
  LoadWorkPackageSuccess = '[WorkPackage] Load WorkPackage success',
  LoadWorkPackageFailure = '[WorkPackage] Load WorkPackage failure',

  AddWorkPackage = '[WorkPackage] Add WorkPackage entity',
  AddWorkPackageSuccess = '[WorkPackage] Add WorkPackage entity Success',
  AddWorkPackageFailure = '[WorkPackage] Add WorkPackage entity Failure',

  UpdateWorkPackage = '[WorkPackage] Update WorkPackage entity',
  UpdateWorkPackageSuccess = '[WorkPackage] Update WorkPackage entity Success',
  UpdateWorkPackageFailure = '[WorkPackage] Update WorkPackage entity Failure',

  DeleteWorkPackage = '[WorkPackage] Delete WorkPackage entity',
  DeleteWorkPackageSuccess = '[WorkPackage] Delete WorkPackage entity Success',
  DeleteWorkPackageFailure = '[WorkPackage] Delete WorkPackage entity Failure',

  AddOwner = '[WorkPackage] Add Owner',
  AddOwnerSuccess = '[WorkPackage] Add Owner Success',
  AddOwnerFailure = '[WorkPackage] Add Owner Failure',

  DeleteOwner = '[WorkPackage] Delete Owner',
  DeleteOwnerSuccess = '[WorkPackage] Delete Owner Success',
  DeleteOwnerFailure = '[WorkPackage] Delete Owner Failure'
}

export class LoadWorkPackages implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackages;
  constructor(public payload: WorkPackageEntitiesHttpParams) {}
}

export class LoadWorkPackagesSuccess implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackagesSuccess;
  constructor(public payload: WorkPackageEntitiesResponse) {}
}

export class LoadWorkPackagesFailure implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackagesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadWorkPackage implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackage;
  constructor(public payload: string) {}
}

export class LoadWorkPackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class LoadWorkPackageFailure implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageEntity implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackage;
  constructor(public payload: WorkPackageApiRequest) {}
}

export class AddWorkPackageEntitySuccess implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackageSuccess;
  constructor(public payload: WorkPackageEntity) {}
}

export class AddWorkPackageEntityFailure implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageEntity implements Action {
  readonly type = WorkPackageActionTypes.UpdateWorkPackage;
  constructor(public payload: {workPackage: WorkPackageApiRequest, id: string}) {}
}

export class UpdateWorkPackageEntitySuccess implements Action {
  readonly type = WorkPackageActionTypes.UpdateWorkPackageSuccess;
  constructor(public payload: WorkPackageEntity) {}
}

export class UpdateWorkPackageEntityFailure implements Action {
  readonly type = WorkPackageActionTypes.UpdateWorkPackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageEntity implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackage;
  constructor(public payload: string) {}
}

export class DeleteWorkPackageEntitySuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackageSuccess;
  constructor(public payload: string) {}
}

export class DeleteWorkPackageEntityFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class AddOwner implements Action {
  readonly type = WorkPackageActionTypes.AddOwner;
  constructor(public payload: { owners: OwnersEntityOrApproversEntity, workPackageId: string, ownerId: string }) {}
}

export class AddOwnerSuccess implements Action {
  readonly type = WorkPackageActionTypes.AddOwnerSuccess;
  constructor(public payload: WorkPackageEntity) {}
}

export class AddOwnerFailure implements Action {
  readonly type = WorkPackageActionTypes.AddOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class DeleteOwner implements Action {
  readonly type = WorkPackageActionTypes.DeleteOwner;
  constructor(public payload: { workPackageId: string, ownerId: string }) {}
}

export class DeleteOwnerSuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteOwnerSuccess;
  constructor(public payload: string) {}
}

export class DeleteOwnerFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type WorkPackageActionsUnion =
  | LoadWorkPackages
  | LoadWorkPackagesSuccess
  | LoadWorkPackagesFailure
  | LoadWorkPackage
  | LoadWorkPackageSuccess
  | LoadWorkPackageFailure
  | AddWorkPackageEntity
  | AddWorkPackageEntitySuccess
  | AddWorkPackageEntityFailure
  | UpdateWorkPackageEntity
  | UpdateWorkPackageEntitySuccess
  | UpdateWorkPackageEntityFailure
  | DeleteWorkPackageEntity
  | DeleteWorkPackageEntitySuccess
  | DeleteWorkPackageEntityFailure
  | DeleteOwner
  | DeleteOwnerSuccess
  | DeleteOwnerFailure
  | AddOwner
  | AddOwnerSuccess
  | AddOwnerFailure;
