import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { DimensionLink, DimensionLinkApiRequest } from '../models/dimension-link.model';
import { DimensionApiRequest } from '../models/dimension.model';
import {ModelLinkApiRequest} from '@app/version/store/models/model-links.model';

export enum DimensionLinkActionTypes {
  LoadDimensionLinks = '[Dimension-Links] Load Dimension Links',
  LoadDimensionLinksSuccess = '[Dimension-Links] Load Dimension Links Success',
  LoadDimensionLinksFailure = '[Dimension-links] Load Dimension Links Fail',
  AddDimensionLink = '[Dimension-Links] Add Dimension',
  AddDimensionLinkSuccess = '[Dimension-Links] Add Dimension Link Success',
  AddDimensionLinkFailure = '[Dimension-Links] Add Dimension Link Fail',
  UpdateDimensionLink = '[Dimension-Links] Update Dimension Link',
  UpdateDimensionLinkSuccess = '[Dimension-Links] Update Dimension Link Success',
  UpdateDimensionLinkFailure = '[Dimension-Links] Update DimensionLInk Fail',
  DeleteDimensionLink = '[Dimension-Links] Delete Dimension Link',
  DeleteDimensionLinkSuccess = '[Dimension-Links] Delete Dimension Link Success',
  DeleteDimensionLinkFailure = '[Dimension-Links] Delete Dimension Link Fail',
}

export class LoadDimensionLinks implements Action {
  readonly type = DimensionLinkActionTypes.LoadDimensionLinks;
  constructor(public payload: string) {}
}

export class LoadDimensionLinksSuccess implements Action {
  readonly type = DimensionLinkActionTypes.LoadDimensionLinksSuccess;
  constructor(public payload: DimensionLink[]) {}
}

export class LoadDimensionLinksFailure implements Action {
  readonly type = DimensionLinkActionTypes.LoadDimensionLinksFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddDimensionLink implements Action {
  readonly type = DimensionLinkActionTypes.AddDimensionLink;
  constructor(public payload: { dimensionLink: DimensionLinkApiRequest, versionId: string}) {}
}

export class AddDimensionLinkSuccess implements Action {
  readonly type = DimensionLinkActionTypes.AddDimensionLinkSuccess;
  constructor(public payload: DimensionLink ) {}
}

export class AddDimensionLinkFailure implements Action {
  readonly type = DimensionLinkActionTypes.AddDimensionLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateDimensionLink implements Action {
  readonly type = DimensionLinkActionTypes.UpdateDimensionLink;
  constructor(public payload: { dimensionLink: DimensionLinkApiRequest, versionId: string}[]) {}
}

export class UpdateDimensionLinkSuccess implements Action {
  readonly type = DimensionLinkActionTypes.UpdateDimensionLinkSuccess;
  constructor(public payload: any) {}
}

export class UpdateDimensionLinkFailure implements Action {
  readonly type = DimensionLinkActionTypes.UpdateDimensionLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteDimensionLink implements Action {
  readonly type = DimensionLinkActionTypes.DeleteDimensionLink;
  constructor(public payload: {versionId: string, dimensionLinkId: string}) {}
}

export class DeleteDimensionLinkSuccess implements Action {
  readonly type = DimensionLinkActionTypes.DeleteDimensionLinkSuccess;
  constructor(public payload: string) {}
}

export class DeleteDimensionLinkFailure implements Action {
  readonly type = DimensionLinkActionTypes.DeleteDimensionLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type DimensionLinkActionsUnion =
  | LoadDimensionLinks
  | LoadDimensionLinksSuccess
  | LoadDimensionLinksFailure
  | AddDimensionLink
  | AddDimensionLinkSuccess
  | AddDimensionLinkFailure
  | UpdateDimensionLink
  | UpdateDimensionLinkSuccess
  | UpdateDimensionLinkFailure
  | DeleteDimensionLink
  | DeleteDimensionLinkSuccess
  | DeleteDimensionLinkFailure;

