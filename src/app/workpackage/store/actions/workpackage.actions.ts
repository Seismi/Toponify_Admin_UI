import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse,
  WorkPackageDetail, WorkPackageApiRequest, WorkPackageEntity, OwnersEntityOrApproversEntity } from '../models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';


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
  DeleteOwnerFailure = '[WorkPackage] Delete Owner Failure',

  SetWorkpackageDisplayColour = '[WorkPackage] Set Display Colour',
  SetWorkpackageEditMode = '[WorkPackage] Set edit mode',
  SetWorkpackageSelected = '[WorkPackage] Set Selected',

  AddObjective = '[WorkPackage] Add Objective',
  AddObjectiveSuccess = '[WorkPackage] Add Objective Success',
  AddObjectiveFailure = '[WorkPackage] Add Objective Failure',

  DeleteObjective = '[WorkPackage] Delete Objective',
  DeleteObjectiveSuccess = '[WorkPackage] Delete Objective Success',
  DeleteObjectiveFailure = '[WorkPackage] Delete Objective Failure',

  AddRadio = '[WorkPackage] Add Radio',
  AddRadioSuccess = '[WorkPackage] Add Radio Success',
  AddRadioFailure = '[WorkPackage] Add Radio Failure',

  DeleteRadio = '[WorkPackage] Delete Radio',
  DeleteRadioSuccess = '[WorkPackage] Delete Radio Success',
  DeleteRadioFailure = '[WorkPackage] Delete Radio Failure',

  GetWorkpackageAvailability = '[Workpackage] Get workpackage availability',
  GetWorkpackageAvailabilitySuccess = '[Workpackage] Get workpackage availability success',
  GetWorkpackageAvailabilityFailure = '[Workpackage] Get workpackage availability failure',
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
  constructor(public payload: {workPackage: WorkPackageApiRequest, entityId: string}) {}
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
  constructor(public payload: any) {}
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
  constructor(public payload: any) {}
}

export class DeleteOwnerFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteOwnerFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SetWorkpackageDisplayColour implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageDisplayColour;
  constructor(public payload: {colour: string, workpackageId: string}) { }
}

export class SetWorkpackageEditMode implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageEditMode;
  constructor(public payload: { id: string }) { }
}

export class SetWorkpackageSelected implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageSelected;
  constructor(public payload: { workpackageId: string }) { }
}

export class AddObjective implements Action {
  readonly type = WorkPackageActionTypes.AddObjective;
  constructor(public payload: { data: RadioEntity, workPackageId: string, radioId: string }) {}
}

export class AddObjectiveSuccess implements Action {
  readonly type = WorkPackageActionTypes.AddObjectiveSuccess;
  constructor(public payload: any) {}
}

export class AddObjectiveFailure implements Action {
  readonly type = WorkPackageActionTypes.AddObjectiveFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteObjective implements Action {
  readonly type = WorkPackageActionTypes.DeleteObjective;
  constructor(public payload: { workPackageId: string, radioId: string }) {}
}

export class DeleteObjectiveSuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteObjectiveSuccess;
  constructor(public payload: any) {}
}

export class DeleteObjectiveFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteObjectiveFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddRadio implements Action {
  readonly type = WorkPackageActionTypes.AddRadio;
  constructor(public payload: { data: RadioEntity, workPackageId: string, radioId: string }) {}
}

export class AddRadioSuccess implements Action {
  readonly type = WorkPackageActionTypes.AddRadioSuccess;
  constructor(public payload: any) {}
}

export class AddRadioFailure implements Action {
  readonly type = WorkPackageActionTypes.AddRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteRadio implements Action {
  readonly type = WorkPackageActionTypes.DeleteRadio;
  constructor(public payload: { workPackageId: string, radioId: string }) {}
}

export class DeleteRadioSuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteRadioSuccess;
  constructor(public payload: any) {}
}

export class DeleteRadioFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class GetWorkpackageAvailability implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailability;
  constructor(public payload: any) { }
}

export class GetWorkpackageAvailabilitySuccess implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailabilitySuccess;
  constructor(public payload: any) { }
}

export class GetWorkpackageAvailabilityFailure implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailabilityFailure;
  constructor(public payload: any) { }
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
  | AddOwnerFailure
  | SetWorkpackageDisplayColour
  | SetWorkpackageEditMode
  | SetWorkpackageSelected
  | AddObjective
  | AddObjectiveSuccess
  | AddObjectiveFailure
  | DeleteObjective
  | DeleteObjectiveSuccess
  | DeleteObjectiveFailure
  | AddRadio
  | AddRadioSuccess
  | AddRadioFailure
  | DeleteRadio
  | DeleteRadioSuccess
  | DeleteRadioFailure
  | GetWorkpackageAvailability
  | GetWorkpackageAvailabilitySuccess
  | GetWorkpackageAvailabilityFailure
  ;