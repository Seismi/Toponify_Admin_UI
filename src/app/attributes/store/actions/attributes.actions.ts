import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { AttributeEntitiesHttpParams, AttributeEntitiesResponse, AttributeDetail } from '../models/attributes.model';

export enum AttributeActionTypes {
  LoadAttributes = '[Attribute] Load Attributes entities',
  LoadAttributesSuccess = '[Attribute] Load Attributes entities Success',
  LoadAttributesFailure = '[Attribute] Load Attributes entities Fail',

  LoadAttribute = '[Attribute] Load Attribute',
  LoadAttributeSuccess = '[Attribute] Load Attribute Success',
  LoadAttributeFailure = '[Attribute] Load Attribute Fail',

  UpdateAttribute = '[Attribute] Update Attribute',
  UpdateAttributeSuccess = '[Attribute] Update Attribute Success',
  UpdateAttributeFailure = '[Attribute] Update Attribute Fail',

  AddAttribute = '[Attribute] Add Attribute',
  AddAttributeSuccess = '[Attribute] Add Attribute Success',
  AddAttributeFailure = '[Attribute] Add Attribute Fail',
  
  DeleteAttribute = '[Attribute] Delete Attribute',
  DeleteAttributeSuccess = '[Attribute] Delete Attribute Success',
  DeleteAttributeFailure = '[Attribute] Delete Attribute Fail'
}

export class LoadAttributes implements Action {
  readonly type = AttributeActionTypes.LoadAttributes;
  constructor(public payload: AttributeEntitiesHttpParams) {}
}

export class LoadAttributesSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributesSuccess;
  constructor(public payload: AttributeEntitiesResponse) {}
}

export class LoadAttributesFailure implements Action {
  readonly type = AttributeActionTypes.LoadAttributesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class LoadAttribute implements Action {
  readonly type = AttributeActionTypes.LoadAttribute;
  constructor(public payload: string) {}
}

export class LoadAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributeSuccess;
  constructor(public payload: AttributeDetail) {}
}

export class LoadAttributeFailure implements Action {
  readonly type = AttributeActionTypes.LoadAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class UpdateAttribute implements Action {
  readonly type = AttributeActionTypes.UpdateAttribute;
  constructor(public payload: any) {}
}

export class UpdateAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeSuccess;
  constructor(public payload: any) {}
}

export class UpdateAttributeFailure implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class AddAttribute implements Action {
  readonly type = AttributeActionTypes.AddAttribute;
  constructor(public payload: any) {}
}

export class AddAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.AddAttributeSuccess;
  constructor(public payload: any) {}
}

export class AddAttributeFailure implements Action {
  readonly type = AttributeActionTypes.AddAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class DeleteAttribute implements Action {
  readonly type = AttributeActionTypes.DeleteAttribute;
  constructor(public payload: string) {}
}

export class DeleteAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeSuccess;
  constructor(public payload: string) {}
}

export class DeleteAttributeFailure implements Action {
  readonly type = AttributeActionTypes.DeleteAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type AttributeActionsUnion =
  | LoadAttributes
  | LoadAttributesSuccess
  | LoadAttributesFailure
  | LoadAttribute
  | LoadAttributeSuccess
  | LoadAttributeFailure
  | UpdateAttribute
  | UpdateAttributeSuccess
  | UpdateAttributeFailure
  | AddAttribute
  | AddAttributeSuccess
  | AddAttributeFailure
  | DeleteAttribute
  | DeleteAttributeSuccess
  | DeleteAttributeFailure;