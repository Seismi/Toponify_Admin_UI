import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Dimension, DimensionApiRequest } from '../models/dimension.model';
import {ModelApiRequest} from '@app/version/store/models/model-version.model';

export enum DimensionActionTypes {
  LoadDimensions = '[Dimension] Load  Dimension',
  LoadDimensionsSuccess = '[Dimension] Load  Dimension Success',
  LoadDimensionsFailure = '[Dimension] Load  Dimension Fail',
  AddDimension = '[Dimension] Add Dimension',
  AddDimensionSuccess = '[Dimension] Add Dimension Success',
  AddDimensionFailure = '[Dimension] Add Dimension Fail',
  UpdateDimension = '[Dimension] Update Dimension System',
  UpdateDimensionSuccess = '[Dimension] Update Dimension Success',
  UpdateDimensionFailure = '[Dimension] Update Dimension Fail',
  DeleteDimension = '[Dimension] Delete Dimension System',
  DeleteDimensionSuccess = '[Dimension] Delete Dimension Success',
  DeleteDimensionFailure = '[Dimension] Delete Dimension Fail',
}

export class LoadDimensions implements Action {
  readonly type = DimensionActionTypes.LoadDimensions;
  constructor(public payload: string) {}
}

export class LoadDimensionsSuccess implements Action {
  readonly type = DimensionActionTypes.LoadDimensionsSuccess;
  constructor(public payload: Dimension[]) {}
}

export class LoadDimensionsFailure implements Action {
  readonly type = DimensionActionTypes.LoadDimensionsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddDimension implements Action {
  readonly type = DimensionActionTypes.AddDimension;
  constructor(public payload: { dimension: DimensionApiRequest, versionId: string }) {}
}

export class AddDimensionSuccess implements Action {
  readonly type = DimensionActionTypes.AddDimensionSuccess;
  constructor(public payload: Dimension) {}
}

export class AddDimensionFailure implements Action {
  readonly type = DimensionActionTypes.AddDimensionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateDimension implements Action {
  readonly type = DimensionActionTypes.UpdateDimension;
  constructor(public payload: { dimension: DimensionApiRequest, versionId: string }) {}
}

export class UpdateDimensionSuccess implements Action {
  readonly type = DimensionActionTypes.UpdateDimensionSuccess;
  constructor(public payload: Dimension) {}
}

export class UpdateDimensionFailure implements Action {
  readonly type = DimensionActionTypes.UpdateDimensionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteDimension implements Action {
  readonly type = DimensionActionTypes.DeleteDimension;
  constructor(public payload: {versionId: string, dimensionId: string}) {}
}

export class DeleteDimensionSuccess implements Action {
  readonly type = DimensionActionTypes.DeleteDimensionSuccess;
  constructor(public payload: string) {}
}

export class DeleteDimensionFailure implements Action {
  readonly type = DimensionActionTypes.DeleteDimensionFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type DimensionActionsUnion =
  | LoadDimensions
  | LoadDimensionsSuccess
  | LoadDimensionsFailure
  | AddDimension
  | AddDimensionSuccess
  | AddDimensionFailure
  | UpdateDimension
  | UpdateDimensionSuccess
  | UpdateDimensionFailure
  | DeleteDimension
  | DeleteDimensionSuccess
  | DeleteDimensionFailure;

