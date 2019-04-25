import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { SystemLink, SystemLinkApiRequest } from '../models/system-links.model';

export enum SystemLinkActionTypes {
  LoadSystemLinks = '[System] Load System Links',
  LoadSystemLinksSuccess = '[System] Load System Links Success',
  LoadSystemLinksFailure = '[System] Load System Links Fail',
  AddSystemLinks = '[System] Add System Links',
  AddSystemLinksSuccess = '[System] Add System Links Success',
  AddSystemLinksFailure = '[System] Add System Links Fail',
  UpdateSystemLinks = '[System] Update System Links',
  UpdateSystemLinksSuccess = '[System] Update System Links Success',
  UpdateSystemLinksFailure = '[System] Update System Links Fail',
  DeleteSystemLink = '[System] Delete System Link',
  DeleteSystemLinkSuccess = '[System] Delete System Link Success',
  DeleteSystemLinkFailure = '[System] Delete System Link Fail'
}

export class LoadSystemLinks implements Action {
  readonly type = SystemLinkActionTypes.LoadSystemLinks;
  constructor(public payload: string) {}
}

export class LoadSystemLinksSuccess implements Action {
  readonly type = SystemLinkActionTypes.LoadSystemLinksSuccess;
  constructor(public payload: SystemLink[]) {}
}

export class LoadSystemLinksFailure implements Action {
  readonly type = SystemLinkActionTypes.LoadSystemLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddSystemLinks implements Action {
  readonly type = SystemLinkActionTypes.AddSystemLinks;
  constructor(public payload: { systemLink: SystemLinkApiRequest, versionId: string}) {}
}

export class AddSystemLinksSuccess implements Action {
  readonly type = SystemLinkActionTypes.AddSystemLinksSuccess;
  constructor(public payload: SystemLink) {}
}

export class AddSystemLinksFailure implements Action {
  readonly type = SystemLinkActionTypes.AddSystemLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateSystemLinks implements Action {
  readonly type = SystemLinkActionTypes.UpdateSystemLinks;
  constructor(public payload: { systemLink: SystemLinkApiRequest, versionId: string}[]) {}
}

export class UpdateSystemLinksSuccess implements Action {
  readonly type = SystemLinkActionTypes.UpdateSystemLinksSuccess;
  constructor(public payload: any) {}
}

export class UpdateSystemLinksFailure implements Action {
  readonly type = SystemLinkActionTypes.UpdateSystemLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteSystemLink implements Action {
  readonly type = SystemLinkActionTypes.DeleteSystemLink;
  constructor(public payload: { versionId: string, systemLinkId: string}) {}
}

export class DeleteSystemLinkSuccess implements Action {
  readonly type = SystemLinkActionTypes.DeleteSystemLinkSuccess;
  constructor(public payload: string) {}
}

export class DeleteSystemLinkFailure implements Action {
  readonly type = SystemLinkActionTypes.DeleteSystemLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type SystemLinkActionsUnion =
  | LoadSystemLinks
  | LoadSystemLinksSuccess
  | LoadSystemLinksFailure
  | AddSystemLinks
  | AddSystemLinksSuccess
  | AddSystemLinksFailure
  | UpdateSystemLinks
  | UpdateSystemLinksSuccess
  | UpdateSystemLinksFailure
  | DeleteSystemLink
  | DeleteSystemLinkSuccess
  | DeleteSystemLinkFailure;

