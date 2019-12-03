import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentStandard, DocumentStandardApiRequest } from '../models/documentation-standards.model';

export enum DocumentationStandardActionTypes {
  LoadDocumentationStandards = '[DocumentationStandard] Load DocumentationStandards',
  LoadDocumentationStandardsSuccess = '[DocumentationStandard] Load DocumentationStandards Success',
  LoadDocumentationStandardsFailure = '[DocumentationStandard] Load DocumentationStandards Fail',

  LoadDocumentationStandard = '[DocumentationStandard] Load DocumentationStandard',
  LoadDocumentationStandardSuccess = '[DocumentationStandard] Load DocumentationStandard Success',
  LoadDocumentationStandardFailure = '[DocumentationStandard] Load DocumentationStandard Fail',

  AddDocumentationStandard = '[DocumentationStandard] Add DocumentationStandard entity',
  AddDocumentationStandardSuccess = '[DocumentationStandard] Add DocumentationStandard entity Success',
  AddDocumentationStandardFailure = '[DocumentationStandard] Add DocumentationStandard entity Failure',

  UpdateDocumentationStandard = '[DocumentationStandard] Update DocumentationStandard entity',
  UpdateDocumentationStandardSuccess = '[DocumentationStandard] Update DocumentationStandard entity Success',
  UpdateDocumentationStandardFailure = '[DocumentationStandard] Update DocumentationStandard entity Failure',

  DeleteDocumentationStandard = '[DocumentationStandard] Delete DocumentationStandard entity',
  DeleteDocumentationStandardSuccess = '[DocumentationStandard] Delete DocumentationStandard entity Success',
  DeleteDocumentationStandardFailure = '[DocumentationStandard] Delete DocumentationStandard entity Failure'
}

export class LoadDocumentationStandards implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandards;
  constructor(public payload: any) {}
}

export class LoadDocumentationStandardsSuccess implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandardsSuccess;
  constructor(public payload: any) {}
}

export class LoadDocumentationStandardsFailure implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandardsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadDocumentationStandard implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandard;
  constructor(public payload: string) {}
}

export class LoadDocumentationStandardSuccess implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandardSuccess;
  constructor(public payload: DocumentStandard) {}
}

export class LoadDocumentationStandardFailure implements Action {
  readonly type = DocumentationStandardActionTypes.LoadDocumentationStandardFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddDocumentationStandard implements Action {
  readonly type = DocumentationStandardActionTypes.AddDocumentationStandard;
  constructor(public payload: DocumentStandardApiRequest) {}
}

export class AddDocumentationStandardSuccess implements Action {
  readonly type = DocumentationStandardActionTypes.AddDocumentationStandardSuccess;
  constructor(public payload: DocumentStandard) {}
}

export class AddDocumentationStandardFailure implements Action {
  readonly type = DocumentationStandardActionTypes.AddDocumentationStandardFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateDocumentationStandard implements Action {
  readonly type = DocumentationStandardActionTypes.UpdateDocumentationStandard;
  constructor(public payload: { id: string; data: DocumentStandardApiRequest }) {}
}

export class UpdateDocumentationStandardSuccess implements Action {
  readonly type = DocumentationStandardActionTypes.UpdateDocumentationStandardSuccess;
  constructor(public payload: DocumentStandard) {}
}

export class UpdateDocumentationStandardFailure implements Action {
  readonly type = DocumentationStandardActionTypes.UpdateDocumentationStandardFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteDocumentationStandard implements Action {
  readonly type = DocumentationStandardActionTypes.DeleteDocumentationStandard;
  constructor(public payload: string) {}
}

export class DeleteDocumentationStandardSuccess implements Action {
  readonly type = DocumentationStandardActionTypes.DeleteDocumentationStandardSuccess;
  constructor(public payload: any) {}
}

export class DeleteDocumentationStandardFailure implements Action {
  readonly type = DocumentationStandardActionTypes.DeleteDocumentationStandardFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type DocumentationStandardActionsUnion =
  | LoadDocumentationStandards
  | LoadDocumentationStandardsSuccess
  | LoadDocumentationStandardsFailure
  | LoadDocumentationStandard
  | LoadDocumentationStandardSuccess
  | LoadDocumentationStandardFailure
  | AddDocumentationStandard
  | AddDocumentationStandardSuccess
  | AddDocumentationStandardFailure
  | UpdateDocumentationStandard
  | UpdateDocumentationStandardSuccess
  | UpdateDocumentationStandardFailure
  | DeleteDocumentationStandard
  | DeleteDocumentationStandardSuccess
  | DeleteDocumentationStandardFailure;
