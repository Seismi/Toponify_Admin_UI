import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { ElementLink, ElementLinkApiRequest } from '../models/element-link.model';

export enum ElementLinkActionTypes {
  LoadElementLinks = '[Element-Link] Load Element Links',
  LoadElementLinksSuccess = '[Element-Link] Load Element Links Success',
  LoadElementLinksFailure = '[Element-Link] Load Element Links Fail',
  AddElementLink = '[Element-Link] Add Element Links',
  AddElementLinkSuccess = '[Element-Link] Add Element Links Success',
  AddElementLinkFailure = '[Element-Link] Add Element Links Fail',
  UpdateElementLink = '[Element-Link] Update Element Links',
  UpdateElementLinkSuccess = '[Element-Link] Update Element Links Success',
  UpdateElementLinkFailure = '[Element-Link] Update Element Links Fail',
  DeleteElementLink = '[Element-Link] Delete Element Links',
  DeleteElementLinkSuccess = '[Element-Link] Delete Element Links Success',
  DeleteElementLinkFailure = '[Element-Link] Delete Element Links Fail'
}

export class LoadElementLinks implements Action {
  readonly type = ElementLinkActionTypes.LoadElementLinks;
  constructor(public payload: string) {}
}

export class LoadElementLinksSuccess implements Action {
  readonly type = ElementLinkActionTypes.LoadElementLinksSuccess;
  constructor(public payload: ElementLink[]) {}
}

export class LoadElementLinksFailure implements Action {
  readonly type = ElementLinkActionTypes.LoadElementLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddElementLink implements Action {
  readonly type = ElementLinkActionTypes.AddElementLink;
  constructor(public payload: { elementLink: ElementLinkApiRequest, versionId: string}) {}
}

export class AddElementLinkSuccess implements Action {
  readonly type = ElementLinkActionTypes.AddElementLinkSuccess;
  constructor(public payload: ElementLink ) {}
}

export class AddElementLinkFailure implements Action {
  readonly type = ElementLinkActionTypes.AddElementLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateElementLink implements Action {
  readonly type = ElementLinkActionTypes.UpdateElementLink;
  constructor(public payload: { elementLink: ElementLinkApiRequest, versionId: string}[]) {}
}

export class UpdateElementLinkSuccess implements Action {
  readonly type = ElementLinkActionTypes.UpdateElementLinkSuccess;
  constructor(public payload: any) {}
}

export class UpdateElementLinkFailure implements Action {
  readonly type = ElementLinkActionTypes.UpdateElementLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteElementLink implements Action {
  readonly type = ElementLinkActionTypes.DeleteElementLink;
  constructor(public payload: {versionId: string, elementLinkId: string}) {}
}

export class DeleteElementLinkSuccess implements Action {
  readonly type = ElementLinkActionTypes.DeleteElementLinkSuccess;
  constructor(public payload: string) {}
}

export class DeleteElementLinkFailure implements Action {
  readonly type = ElementLinkActionTypes.DeleteElementLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type ElementLinkActionsUnion =
  | LoadElementLinks
  | LoadElementLinksSuccess
  | LoadElementLinksFailure
  | AddElementLink
  | AddElementLinkSuccess
  | AddElementLinkFailure
  | UpdateElementLink
  | UpdateElementLinkSuccess
  | UpdateElementLinkFailure
  | DeleteElementLink
  | DeleteElementLinkSuccess
  | DeleteElementLinkFailure;

