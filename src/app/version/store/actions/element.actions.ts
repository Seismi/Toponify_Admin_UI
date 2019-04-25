import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Element, ElementApiRequest } from '../models/element.model';

export enum ElementActionTypes {
  LoadElements = '[Elements] Load Elements',
  LoadElementsSuccess = '[Elements] Load Elements Success',
  LoadElementsFailure = '[Elements] Load Elements Fail',
  AddElement = '[Elements] Add Elements',
  AddElementSuccess = '[Elements] Add Elements Success',
  AddElementFailure = '[Elements] Add Elements Fail',
  UpdateElement = '[Elements] Update Elements',
  UpdateElementSuccess = '[Elements] Update Elements Success',
  UpdateElementFailure = '[Elements] Update Elements Fail',
  DeleteElement = '[Elements] Delete Elements',
  DeleteElementSuccess = '[Elements] Delete Elements Success',
  DeleteElementFailure = '[Elements] Delete Elements Fail'
}

export class LoadElements implements Action {
  readonly type = ElementActionTypes.LoadElements;
  constructor(public payload: string) {}
}

export class LoadElementsSuccess implements Action {
  readonly type = ElementActionTypes.LoadElementsSuccess;
  constructor(public payload: Element[]) {}
}

export class LoadElementsFailure implements Action {
  readonly type = ElementActionTypes.LoadElementsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddElement implements Action {
  readonly type = ElementActionTypes.AddElement;
  constructor(public payload: { element: ElementApiRequest, versionId: string }) {}
}

export class AddElementSuccess implements Action {
  readonly type = ElementActionTypes.AddElementSuccess;
  constructor(public payload: Element) {}
}

export class AddElementFailure implements Action {
  readonly type = ElementActionTypes.AddElementFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateElement implements Action {
  readonly type = ElementActionTypes.UpdateElement;
  constructor(public payload: { element: ElementApiRequest, versionId: string }) {}
}

export class UpdateElementSuccess implements Action {
  readonly type = ElementActionTypes.UpdateElementSuccess;
  constructor(public payload: Element) {}
}

export class UpdateElementFailure implements Action {
  readonly type = ElementActionTypes.UpdateElementFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteElement implements Action {
  readonly type = ElementActionTypes.DeleteElement;
  constructor(public payload: {versionId: string, elementId: string}) {}
}

export class DeleteElementSuccess implements Action {
  readonly type = ElementActionTypes.DeleteElementSuccess;
  constructor(public payload: string) {}
}

export class DeleteElementFailure implements Action {
  readonly type = ElementActionTypes.DeleteElementFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type ElementActionsUnion =
  | LoadElements
  | LoadElementsSuccess
  | LoadElementsFailure
  | AddElement
  | AddElementSuccess
  | AddElementFailure
  | UpdateElement
  | UpdateElementSuccess
  | UpdateElementFailure
  | DeleteElement
  | DeleteElementSuccess
  | DeleteElementFailure;

