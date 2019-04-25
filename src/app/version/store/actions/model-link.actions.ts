import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ModelLink, ModelLinkApiRequest, ModelLinkSingleApiResponse } from '../models/model-links.model';

export enum ModelLinkActionTypes {
  LoadModelLinks = '[Model-Links] Load Model Links',
  LoadModelLinksSuccess = '[Model-Links] Load Model Links Success',
  LoadModelLinksFailure = '[Model-Links] Load Model Links Fail',
  AddModelLink = '[Model] Add Model Link',
  AddModelLinkSuccess = '[Model] Add Model Link Success',
  AddModelLinkFailure = '[Model] Add Model LInk Fail',
  UpdateModelLink = '[Model] Update Model Link System',
  UpdateModelLinkSuccess = '[Model] Update Model Link Success',
  UpdateModelLinkFailure = '[Model] Update Model Link Fail',
  DeleteModelLink = '[Model] Delete Model Link',
  DeleteModelLinkSuccess = '[Model] Delete Model Link Success',
  DeleteModelLinkFailure = '[Model] Delete Model Link Fail'
}

export class LoadModelLinks implements Action {
  readonly type = ModelLinkActionTypes.LoadModelLinks;
  constructor(public payload: string) {}
}

export class LoadModelLinksSuccess implements Action {
  readonly type = ModelLinkActionTypes.LoadModelLinksSuccess;
  constructor(public payload: ModelLink[]) {}
}

export class LoadModelLinksFailure implements Action {
  readonly type = ModelLinkActionTypes.LoadModelLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddModelLink implements Action {
  readonly type = ModelLinkActionTypes.AddModelLink;
  constructor(public payload: {modelLink: ModelLinkApiRequest, versionId: string}) {}
}

export class AddModelLinkSuccess implements Action {
  readonly type = ModelLinkActionTypes.AddModelLinkSuccess;
  constructor(public payload: ModelLink) {}
}

export class AddModelLinkFailure implements Action {
  readonly type = ModelLinkActionTypes.AddModelLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateModelLink implements Action {
  readonly type = ModelLinkActionTypes.UpdateModelLink;
  constructor(public payload: {modelLink: ModelLinkApiRequest, versionId: string}[]) {}
}

export class UpdateModelLinkSuccess implements Action {
  readonly type = ModelLinkActionTypes.UpdateModelLinkSuccess;
  constructor(public payload: any) {}
}

export class UpdateModeLinkFailure implements Action {
  readonly type = ModelLinkActionTypes.UpdateModelLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteModelLink implements Action {
  readonly type = ModelLinkActionTypes.DeleteModelLink;
  constructor(public payload: {versionId: string, modelLinkId: string}) {}
}

export class DeleteModelLinkSuccess implements Action {
  readonly type = ModelLinkActionTypes.DeleteModelLinkSuccess;
  constructor(public payload: string) {}
}

export class DeleteModeLinkFailure implements Action {
  readonly type = ModelLinkActionTypes.DeleteModelLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type ModelLinkActionsUnion =
  | LoadModelLinks
  | LoadModelLinksSuccess
  | LoadModelLinksFailure
  | AddModelLink
  | AddModelLinkSuccess
  | AddModelLinkFailure
  | UpdateModelLink
  | UpdateModelLinkSuccess
  | UpdateModeLinkFailure
  | DeleteModelLink
  | DeleteModelLinkSuccess
  | DeleteModeLinkFailure;

