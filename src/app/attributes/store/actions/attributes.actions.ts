import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { AttributeEntitiesHttpParams, AttributeEntitiesResponse, AttributeDetail } from '../models/attributes.model';

export enum AttributeActionTypes {
  LoadAttributes = '[Attribute] Load Attributes entities',
  LoadAttributesSuccess = '[Attribute] Load Attributes entities Success',
  LoadAttributesFailure = '[Attribute] Load Attributes entities Fail',

  LoadAttribute = '[Attribute] Load Attribute',
  LoadAttributeSuccess = '[Attribute] Load Attribute Success',
  LoadAttributeFailure = '[Attribute] Load Attribute Fail'
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


export type AttributeActionsUnion =
  | LoadAttributes
  | LoadAttributesSuccess
  | LoadAttributesFailure
  | LoadAttribute
  | LoadAttributeSuccess
  | LoadAttributeFailure;