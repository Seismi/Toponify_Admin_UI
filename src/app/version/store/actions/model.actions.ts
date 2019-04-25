import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Model, ModelApiResponse, ModelApiRequest } from '../models/model-version.model';

export enum ModelActionTypes {
  LoadModels = '[Model] Load Models',
  LoadModelsSuccess = '[Model] Load Models Success',
  LoadModelsFailure = '[Model] Load Models Fail',
  AddModel = '[Model] Add Model',
  AddModelSuccess = '[Model] Add Model Success',
  AddModelFailure = '[Model] Add Model Fail',
  UpdateModel = '[Model] Update Model System',
  UpdateModelSuccess = '[Model] Update Model Success',
  UpdateModelFailure = '[Model] Update Model Fail',
  DeleteModel = '[Model] Delete Model System',
  DeleteModelSuccess = '[Model] Delete Model Success',
  DeleteModelFailure = '[Model] Delete Model Fail',
}

export class LoadModels implements Action {
  readonly type = ModelActionTypes.LoadModels;
  constructor(public payload: string) {}
}

export class LoadModelsSuccess implements Action {
  readonly type = ModelActionTypes.LoadModelsSuccess;
  constructor(public payload: Model[]) {}
}

export class LoadModelsFailure implements Action {
  readonly type = ModelActionTypes.LoadModelsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddModel implements Action {
  readonly type = ModelActionTypes.AddModel;
  constructor(public payload: { model: ModelApiRequest, versionId: string }) {}
}

export class AddModelSuccess implements Action {
  readonly type = ModelActionTypes.AddModelSuccess;
  constructor(public payload: Model) {}
}

export class AddModelFailure implements Action {
  readonly type = ModelActionTypes.AddModelFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateModel implements Action {
  readonly type = ModelActionTypes.UpdateModel;
  constructor(public payload: { model: ModelApiRequest, versionId: string }) {}
}

export class UpdateModelSuccess implements Action {
  readonly type = ModelActionTypes.UpdateModelSuccess;
  constructor(public payload: Model) {}
}

export class UpdateModelFailure implements Action {
  readonly type = ModelActionTypes.UpdateModelFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteModel implements Action {
  readonly type = ModelActionTypes.DeleteModel;
  constructor(public payload: {versionId: string, modelId: string}) {}
}

export class DeleteModelSuccess implements Action {
  readonly type = ModelActionTypes.DeleteModelSuccess;
  constructor(public payload: string) {}
}

export class DeleteModelFailure implements Action {
  readonly type = ModelActionTypes.DeleteModelFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type ModelActionsUnion =
  | LoadModels
  | LoadModelsSuccess
  | LoadModelsFailure
  | AddModel
  | AddModelSuccess
  | AddModelFailure
  | UpdateModel
  | UpdateModelSuccess
  | UpdateModelFailure
  | DeleteModel
  | DeleteModelSuccess
  | DeleteModelFailure;

