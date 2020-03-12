import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {
  OwnersEntityOrApproversEntity,
  WorkPackageApiRequest,
  WorkPackageDetail,
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse,
  WorkPackageEntity,
  Objective,
  Baseline
} from '../models/workpackage.models';
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
  SetSelectedWorkPackages = '[WorkPackage] Set Selected Work Packages',

  AddObjective = '[WorkPackage] Add Objective',
  AddObjectiveSuccess = '[WorkPackage] Add Objective Success',
  AddObjectiveFailure = '[WorkPackage] Add Objective Failure',

  CreateObjective = '[WorkPackage] Create Objective',
  CreateObjectiveSuccess = '[WorkPackage] Create Objective Success',
  CreateObjectiveFailure = '[WorkPackage] Create Objective Failure',

  DeleteObjective = '[WorkPackage] Delete Objective',
  DeleteObjectiveSuccess = '[WorkPackage] Delete Objective Success',
  DeleteObjectiveFailure = '[WorkPackage] Delete Objective Failure',

  AddRadio = '[WorkPackage] Add Radio',
  AddRadioSuccess = '[WorkPackage] Add Radio Success',
  AddRadioFailure = '[WorkPackage] Add Radio Failure',

  DeleteRadio = '[WorkPackage] Delete Radio',
  DeleteRadioSuccess = '[WorkPackage] Delete Radio Success',
  DeleteRadioFailure = '[WorkPackage] Delete Radio Failure',

  UpdateCustomProperty = '[WorkPackage] Update Custom Property',
  UpdateCustomPropertySuccess = '[WorkPackage] Update Custom Property Success',
  UpdateCustomPropertyFailure = '[WorkPackage] Update Custom Property Failure',

  DeleteCustomProperty = '[WorkPackage] Delete Custom Property',
  DeleteCustomPropertySuccess = '[WorkPackage] Delete Custom Property Success',
  DeleteCustomPropertyFailure = '[WorkPackage] Delete Custom Property Failure',

  GetWorkpackageAvailability = '[Workpackage] Get workpackage availability',
  GetWorkpackageAvailabilitySuccess = '[Workpackage] Get workpackage availability success',
  GetWorkpackageAvailabilityFailure = '[Workpackage] Get workpackage availability failure',

  SubmitWorkpackage = '[Workpackage] Submit Workpackage',
  SubmitWorkpackageSuccess = '[Workpackage] Submit Workpackage Success',
  SubmitWorkpackageFailure = '[Workpackage] Submit Workpackage Failure',

  ApproveWorkpackage = '[Workpackage] Approve Workpackage',
  ApproveWorkpackageSuccess = '[Workpackage] Approve Workpackage Success',
  ApproveWorkpackageFailure = '[Workpackage] Approve Workpackage Failure',

  RejectWorkpackage = '[Workpackage] Reject Workpackage',
  RejectWorkpackageSuccess = '[Workpackage] Reject Workpackage Success',
  RejectWorkpackageFailure = '[Workpackage] Reject Workpackage Failure',

  MergeWorkpackage = '[Workpackage] Merge Workpackage',
  MergeWorkpackageSuccess = '[Workpackage] Merge Workpackage Success',
  MergeWorkpackageFailure = '[Workpackage] Merge Workpackage Failure',

  ResetWorkpackage = '[Workpackage] Reset Workpackage',
  ResetWorkpackageSuccess = '[Workpackage] Reset Workpackage Success',
  ResetWorkpackageFailure = '[Workpackage] Reset Workpackage Failure',

  SupersedeWorkpackage = '[Workpackage] Supersede Workpackage',
  SupersedeWorkpackageSuccess = '[Workpackage] Supersede Workpackage Success',
  SupersedeWorkpackageFailure = '[Workpackage] Supersede Workpackage Failure',

  ArchiveWorkPackage = '[Workpackage] Archive Workpackage',

  LoadWorkPackageBaselineAvailability = '[WorkPackage] Load WorkPackage Baseline Availability',
  LoadWorkPackageBaselineAvailabilitySuccess = '[WorkPackage] Load WorkPackage Baseline Availability Success',
  LoadWorkPackageBaselineAvailabilityFailure = '[WorkPackage] Load WorkPackage Baseline Availability Failure',

  AddWorkPackageBaseline = '[WorkPackage] Add WorkPackage Baseline',
  AddWorkPackageBaselineSuccess = '[WorkPackage] Add WorkPackage Baseline Success',
  AddWorkPackageBaselineFailure = '[WorkPackage] Add WorkPackage Baseline Failure',

  DeleteWorkPackageBaseline = '[WorkPackage] Delete WorkPackage Baseline',
  DeleteWorkPackageBaselineSuccess = '[WorkPackage] Delete WorkPackage Baseline Success',
  DeleteWorkPackageBaselineFailure = '[WorkPackage] Delete WorkPackage Baseline Failure'
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
  constructor(public payload: { workPackage: WorkPackageApiRequest; entityId: string }) {}
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
  constructor(public payload: { owners: OwnersEntityOrApproversEntity; workPackageId: string; ownerId: string }) {}
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
  constructor(public payload: { workPackageId: string; ownerId: string }) {}
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
  constructor(public payload: { colour: string; workpackageId: string }) {}
}

export class SetWorkpackageEditMode implements Action {
  readonly type = WorkPackageActionTypes.SetWorkpackageEditMode;
  constructor(public payload: { id: string; newState: boolean }) {}
}

export class SetSelectedWorkPackages implements Action {
  readonly type = WorkPackageActionTypes.SetSelectedWorkPackages;
  constructor(public payload: { workPackages: string[] }) {}
}

export class AddObjective implements Action {
  readonly type = WorkPackageActionTypes.AddObjective;
  constructor(public payload: { data: Objective; workPackageId: string; objectiveId: string }) {}
}

export class AddObjectiveSuccess implements Action {
  readonly type = WorkPackageActionTypes.AddObjectiveSuccess;
  constructor(public payload: any) {}
}

export class AddObjectiveFailure implements Action {
  readonly type = WorkPackageActionTypes.AddObjectiveFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class CreateObjective implements Action {
  readonly type = WorkPackageActionTypes.CreateObjective;
  constructor(public payload: { data: { title: string; description: string }; workPackageId: string }) {}
}

export class CreateObjectiveSuccess implements Action {
  readonly type = WorkPackageActionTypes.CreateObjectiveSuccess;
  constructor(public payload: any) {}
}

export class CreateObjectiveFailure implements Action {
  readonly type = WorkPackageActionTypes.CreateObjectiveFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteObjective implements Action {
  readonly type = WorkPackageActionTypes.DeleteObjective;
  constructor(public payload: { workPackageId: string; objectiveId: string }) {}
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
  constructor(public payload: { data: RadioEntity; workPackageId: string; radioId: string }) {}
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
  constructor(public payload: { workPackageId: string; radioId: string }) {}
}

export class DeleteRadioSuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteRadioSuccess;
  constructor(public payload: any) {}
}

export class DeleteRadioFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateCustomProperty implements Action {
  readonly type = WorkPackageActionTypes.UpdateCustomProperty;
  constructor(
    public payload: { workPackageId: string; customPropertyId: string; data: string }
  ) {}
}

export class UpdateCustomPropertySuccess implements Action {
  readonly type = WorkPackageActionTypes.UpdateCustomPropertySuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class UpdateCustomPropertyFailure implements Action {
  readonly type = WorkPackageActionTypes.UpdateCustomPropertyFailure;
  constructor(public payload: Error) {}
}

export class DeleteCustomProperty implements Action {
  readonly type = WorkPackageActionTypes.DeleteCustomProperty;
  constructor(public payload: { workPackageId: string; customPropertyId: string }) {}
}

export class DeleteCustomPropertySuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteCustomPropertySuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class DeleteCustomPropertyFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteCustomPropertyFailure;
  constructor(public payload: Error) {}
}

export class GetWorkpackageAvailability implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailability;
  constructor(public payload: any) {}
}

export class GetWorkpackageAvailabilitySuccess implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailabilitySuccess;
  constructor(public payload: any) {}
}

export class GetWorkpackageAvailabilityFailure implements Action {
  readonly type = WorkPackageActionTypes.GetWorkpackageAvailabilityFailure;
  constructor(public payload: any) {}
}

export class SubmitWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.SubmitWorkpackage;
  constructor(public payload: string) {}
}

export class SubmitWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.SubmitWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class SubmitWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.SubmitWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ApproveWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.ApproveWorkpackage;
  constructor(public payload: string) {}
}

export class ApproveWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.ApproveWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class ApproveWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.ApproveWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class RejectWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.RejectWorkpackage;
  constructor(public payload: string) {}
}

export class RejectWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.RejectWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class RejectWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.RejectWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class MergeWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.MergeWorkpackage;
  constructor(public payload: string) {}
}

export class MergeWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.MergeWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class MergeWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.MergeWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ResetWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.ResetWorkpackage;
  constructor(public payload: string) {}
}

export class ResetWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.ResetWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class ResetWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.ResetWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SupersedeWorkpackage implements Action {
  readonly type = WorkPackageActionTypes.SupersedeWorkpackage;
  constructor(public payload: string) {}
}

export class SupersedeWorkpackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.SupersedeWorkpackageSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class SupersedeWorkpackageFailure implements Action {
  readonly type = WorkPackageActionTypes.SupersedeWorkpackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ArchiveWorkPackage implements Action {
  readonly type = WorkPackageActionTypes.ArchiveWorkPackage;
  constructor(public payload: { workPackageId: string, archived: boolean }) {}
}

export class LoadWorkPackageBaselineAvailability implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageBaselineAvailability;
  constructor(public payload: { workPackageId: string }) {}
}

export class LoadWorkPackageBaselineAvailabilitySuccess implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageBaselineAvailabilitySuccess;
  constructor(public payload: Baseline[]) {}
}

export class LoadWorkPackageBaselineAvailabilityFailure implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageBaselineAvailabilityFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddWorkPackageBaseline implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackageBaseline;
  constructor(public payload: { workPackageId: string, baselineId: string }) {}
}

export class AddWorkPackageBaselineSuccess implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackageBaselineSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class AddWorkPackageBaselineFailure implements Action {
  readonly type = WorkPackageActionTypes.AddWorkPackageBaselineFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteWorkPackageBaseline implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackageBaseline;
  constructor(public payload: { workPackageId: string, baselineId: string }) {}
}

export class DeleteWorkPackageBaselineSuccess implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackageBaselineSuccess;
  constructor(public payload: WorkPackageDetail) {}
}

export class DeleteWorkPackageBaselineFailure implements Action {
  readonly type = WorkPackageActionTypes.DeleteWorkPackageBaselineFailure;
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
  | AddOwnerFailure
  | SetWorkpackageDisplayColour
  | SetWorkpackageEditMode
  | AddObjective
  | AddObjectiveSuccess
  | AddObjectiveFailure
  | CreateObjective
  | CreateObjectiveSuccess
  | CreateObjectiveFailure
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
  | SubmitWorkpackage
  | SubmitWorkpackageSuccess
  | SubmitWorkpackageFailure
  | ApproveWorkpackage
  | ApproveWorkpackageSuccess
  | ApproveWorkpackageFailure
  | RejectWorkpackage
  | RejectWorkpackageSuccess
  | RejectWorkpackageFailure
  | MergeWorkpackage
  | MergeWorkpackageSuccess
  | MergeWorkpackageFailure
  | ResetWorkpackage
  | ResetWorkpackageSuccess
  | ResetWorkpackageFailure
  | SupersedeWorkpackage
  | SupersedeWorkpackageSuccess
  | SupersedeWorkpackageFailure
  | SetSelectedWorkPackages
  | UpdateCustomProperty
  | UpdateCustomPropertySuccess
  | UpdateCustomPropertyFailure
  | DeleteCustomProperty
  | DeleteCustomPropertySuccess
  | DeleteCustomPropertyFailure
  | ArchiveWorkPackage
  | LoadWorkPackageBaselineAvailability
  | LoadWorkPackageBaselineAvailabilitySuccess
  | LoadWorkPackageBaselineAvailabilityFailure
  | AddWorkPackageBaseline
  | AddWorkPackageBaselineSuccess
  | AddWorkPackageBaselineFailure
  | DeleteWorkPackageBaseline
  | DeleteWorkPackageBaselineSuccess
  | DeleteWorkPackageBaselineFailure;
