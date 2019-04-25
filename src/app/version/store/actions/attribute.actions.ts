import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Attribute, AttributeApiRequest, AddAttributeApiRequest } from '../models/attribute.model';

export enum AttributeActionTypes {
  LoadAttributes = '[Attribute] Load Attributes',
  LoadAttributesSuccess = '[Attribute] Load Attributes Success',
  LoadAttributesFailure = '[Attribute] Load Attributes Fail',
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
  constructor(public payload: string) {}
}

export class LoadAttributesSuccess implements Action {
  readonly type = AttributeActionTypes.LoadAttributesSuccess;
  constructor(public payload: Attribute[]) {}
}

export class LoadAttributesFailure implements Action {
  readonly type = AttributeActionTypes.LoadAttributesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateAttribute implements Action {
  readonly type = AttributeActionTypes.UpdateAttribute;
  constructor(public payload: { attribute: AttributeApiRequest, versionId: string }) {}
}

export class UpdateAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeSuccess;
  constructor(public payload: Attribute) {}
}

export class UpdateAttributeFailure implements Action {
  readonly type = AttributeActionTypes.UpdateAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddAttribute implements Action {
  readonly type = AttributeActionTypes.AddAttribute;
  constructor(public payload: { attribute: AddAttributeApiRequest, versionId: string }) {}
}

export class AddAttributeSuccess implements Action {
  readonly type = AttributeActionTypes.AddAttributeSuccess;
  constructor(public payload: Attribute) {}
}

export class AddAttributeFailure implements Action {
  readonly type = AttributeActionTypes.AddAttributeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteAttribute implements Action {
  readonly type = AttributeActionTypes.DeleteAttribute;
  constructor(public payload: { versionId: string, attributeId: string }) {}
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
  | UpdateAttribute
  | UpdateAttributeSuccess
  | UpdateAttributeFailure
  | DeleteAttribute
  | DeleteAttributeSuccess
  | DeleteAttributeFailure
  | AddAttribute
  | AddAttributeSuccess
  | AddAttributeFailure;

