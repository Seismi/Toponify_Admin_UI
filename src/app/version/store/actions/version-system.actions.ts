import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { System, SystemApiRequest } from '../models/system.model';

export enum VersionSystemActionTypes {
  LoadVersionSystems = '[System] Load Version Systems',
  LoadVersionSystemsSuccess = '[System] Load Version Systems Success',
  LoadVersionSystemsFailure = '[System] Load Version Systems Fail',
  AddVersionSystem = '[System] Add Version System',
  AddVersionSystemSuccess = '[System] Add Version System Success',
  AddVersionSystemFailure = '[System] Add Version System Fail',
  UpdateVersionSystem = '[System] Update Version System',
  UpdateVersionSystemSuccess = '[System] Update Version System Success',
  UpdateVersionSystemFailure = '[System] Update Version System Fail',
  DeleteVersionSystem = '[System] Delete Version System',
  DeleteVersionSystemSuccess = '[System] Delete Version System Success',
  DeleteVersionSystemFailure = '[System] Delete Version System Fail',
}

export class LoadVersionSystems implements Action {
  readonly type = VersionSystemActionTypes.LoadVersionSystems;
  constructor(public payload: string) {}
}

export class LoadVersionSystemsSuccess implements Action {
  readonly type = VersionSystemActionTypes.LoadVersionSystemsSuccess;
  constructor(public payload: System[]) {}
}

export class LoadVersionSystemsFailure implements Action {
  readonly type = VersionSystemActionTypes.LoadVersionSystemsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddVersionSystem implements Action {
  readonly type = VersionSystemActionTypes.AddVersionSystem;
  constructor(public payload: { system: SystemApiRequest, versionId: string }) {}
}

export class AddVersionSystemSuccess implements Action {
  readonly type = VersionSystemActionTypes.AddVersionSystemSuccess;
  constructor(public payload: System) {}
}

export class AddVersionSystemFailure implements Action {
  readonly type = VersionSystemActionTypes.AddVersionSystemFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateVersionSystem implements Action {
  readonly type = VersionSystemActionTypes.UpdateVersionSystem;
  constructor(public payload: { system: SystemApiRequest, versionId: string }) {}
}

export class UpdateVersionSystemSuccess implements Action {
  readonly type = VersionSystemActionTypes.UpdateVersionSystemSuccess;
  constructor(public payload: System) {}
}

export class UpdateVersionSystemFailure implements Action {
  readonly type = VersionSystemActionTypes.UpdateVersionSystemFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteVersionSystem implements Action {
  readonly type = VersionSystemActionTypes.DeleteVersionSystem;
  constructor(public payload: {versionId: string, systemId: string}) {}
}

export class DeleteVersionSystemSuccess implements Action {
  readonly type = VersionSystemActionTypes.DeleteVersionSystemSuccess;
  constructor(public payload: string) {}
}

export class DeleteVersionSystemFailure implements Action {
  readonly type = VersionSystemActionTypes.DeleteVersionSystemFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type VersionSystemActionsUnion =
  | LoadVersionSystems
  | LoadVersionSystemsSuccess
  | LoadVersionSystemsFailure
  | AddVersionSystem
  | AddVersionSystemSuccess
  | AddVersionSystemFailure
  | UpdateVersionSystem
  | UpdateVersionSystemSuccess
  | UpdateVersionSystemFailure
  | DeleteVersionSystem
  | DeleteVersionSystemSuccess
  | DeleteVersionSystemFailure;


