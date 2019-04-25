import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { AddVersionApiRequest, CopyVersionApiRequest, UpdateVersionApiRequest, Version } from '../models/version.model';

export enum VersionActionTypes {
  LoadVersions = '[Version] Load Versions',
  LoadVersionsSuccess = '[Version] Load Versions Success',
  LoadVersionsFailure = '[Version] Load Versions Fail',
  AddVersion = '[Version] Add Version',
  AddVersionSuccess = '[Version] Add Version Success',
  AddVersionFailure = '[Version] Add Version Failure',
  ArchiveVersion = '[Version] Archive Version',
  ArchiveVersionSuccess = '[Version] Archive Version Success',
  ArchiveVersionFailure = '[Version] Archive Version Failure',
  UpdateVersion = '[Version] Update Version',
  UpdateVersionSuccess = '[Version] Update Version Success',
  UpdateVersionFailure = '[Version] Update Version Failure',
  DeleteVersion = '[Version] Delete Version',
  DeleteVersionSuccess = '[Version] Delete Version Success',
  DeleteVersionFailure = '[Version] Delete Version Failure',
  CopyVersion = '[Version] Copy Version',
  CopyVersionSuccess = '[Version] Copy Version Success',
  CopyVersionFailure = '[Version] Copy Version Failure',
  UnarchiveVersion = '[Version] Unarchive Version',
  UnarchiveVersionSuccess = '[Version] Unarchive Version Success',
  UnarchiveVersionFailure = '[Version] Unarchive Version Failure',
  RefetchVersionData = '[Version] Refetch Version data'
}


export class LoadVersions implements Action {
  readonly type = VersionActionTypes.LoadVersions;
  constructor() {}
}

export class LoadVersionsSuccess implements Action {
  readonly type = VersionActionTypes.LoadVersionsSuccess;
  constructor(public payload: Version[]) {}
}

export class LoadVersionsFailure implements Action {
  readonly type = VersionActionTypes.LoadVersionsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddVersion implements Action {
  readonly type = VersionActionTypes.AddVersion;
  constructor(public payload: AddVersionApiRequest) {}
}

export class AddVersionSuccess implements Action {
  readonly type = VersionActionTypes.AddVersionSuccess;
  constructor(public payload: Version) {}
}

export class AddVersionFailure implements Action {
  readonly type = VersionActionTypes.AddVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateVersion implements Action {
  readonly type = VersionActionTypes.UpdateVersion;
  constructor(public payload: UpdateVersionApiRequest) {}
}

export class UpdateVersionSuccess implements Action {
  readonly type = VersionActionTypes.UpdateVersionSuccess;
  constructor(public payload: Version) {}
}

export class UpdateVersionFailure implements Action {
  readonly type = VersionActionTypes.UpdateVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteVersion implements Action {
  readonly type = VersionActionTypes.DeleteVersion;
  constructor(public payload: string) {}
}

export class DeleteVersionSuccess implements Action {
  readonly type = VersionActionTypes.DeleteVersionSuccess;
  constructor(public payload: string) {}
}

export class DeleteVersionFailure implements Action {
  readonly type = VersionActionTypes.DeleteVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class CopyVersion implements Action {
  readonly type = VersionActionTypes.CopyVersion;
  constructor(public payload: CopyVersionApiRequest) {}
}

export class CopyVersionSuccess implements Action {
  readonly type = VersionActionTypes.CopyVersionSuccess;
  constructor(public payload: Version) {}
}

export class CopyVersionFailure implements Action {
  readonly type = VersionActionTypes.CopyVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UnarchiveVersion implements Action {
  readonly type = VersionActionTypes.UnarchiveVersion;
  constructor(public payload: UpdateVersionApiRequest) {}
}

export class UnarchiveVersionSuccess implements Action {
  readonly type = VersionActionTypes.UnarchiveVersionSuccess;
  constructor(public payload: Version) {}
}

export class UnarchiveVersionFailure implements Action {
  readonly type = VersionActionTypes.UnarchiveVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ArchiveVersion implements Action {
  readonly type = VersionActionTypes.ArchiveVersion;
  constructor(public payload: UpdateVersionApiRequest) {}
}

export class ArchiveVersionSuccess implements Action {
  readonly type = VersionActionTypes.ArchiveVersionSuccess;
  constructor(public payload: Version) {}
}

export class ArchiveVersionFailure implements Action {
  readonly type = VersionActionTypes.ArchiveVersionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class RefetchVersionData implements Action {
  readonly type = VersionActionTypes.RefetchVersionData;
  constructor(public payload: {versionId: string}) {}
}


export type VersionActionsUnion =
  | LoadVersions
  | LoadVersionsSuccess
  | LoadVersionsFailure
  | AddVersion
  | AddVersionSuccess
  | AddVersionFailure
  | UpdateVersion
  | UpdateVersionSuccess
  | UpdateVersionFailure
  | ArchiveVersion
  | ArchiveVersionSuccess
  | ArchiveVersionFailure
  | DeleteVersion
  | DeleteVersionSuccess
  | DeleteVersionFailure
  | CopyVersion
  | CopyVersionSuccess
  | CopyVersionFailure
  | UnarchiveVersion
  | UnarchiveVersionSuccess
  | RefetchVersionData
  | UnarchiveVersionFailure;
