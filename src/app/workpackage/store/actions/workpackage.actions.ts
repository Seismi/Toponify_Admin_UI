import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse,
  WorkPackageDetail, WorkPackageApiRequest, WorkPackageEntity } from '../models/workpackage.models';

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
  SetWorkpackageDisplayColour = '[WorkPackage] Set Display Colour',
  SetWorkpackageSelected = '[WorkPackage] Set Selected',
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
  constructor(public payload: any) {}
}

export class UpdateWorkPackageEntitySuccess implements Action {
  readonly type = WorkPackageActionTypes.UpdateWorkPackageSuccess;
  constructor(public payload: any) {}
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

export class SetWorkpackageDisplayColour implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageDisplayColour;
  constructor(public payload: {colour: string, workpackageId: string}) { }
}

export class SetWorkpackageSelected implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageSelected;
  constructor(public payload: { workpackageId: string }) { }
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
  | SetWorkpackageDisplayColour
  | SetWorkpackageSelected;
