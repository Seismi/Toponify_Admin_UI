import { Action } from '@ngrx/store';
import { RadioEntitiesHttpParams, RadioEntitiesResponse, RadioDetail, RadioApiRequest, RadioEntity, ReplyApiRequest } from '../models/radio.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum RadioActionTypes {
  LoadRadios = '[Radio] Load Radio entities',
  LoadRadiosSuccess = '[Radio] Load Radio entities Success',
  LoadRadiosFailure = '[Radio] Load Radio entities Fail',

  LoadRadio = '[Radio] Load Radio',
  LoadRadioSuccess = '[Radio] Load Radio Success',
  LoadRadioFailure = '[Radio] Load Radio Fail',

  AddRadio = '[Radio] Add Radio entity',
  AddRadioSuccess = '[Radio] Add Radio entity Success',
  AddRadioFailure = '[Radio] Add Radio entity Failure',

  AddReply = '[Radio] Add Reply',
  AddReplySuccess = '[Radio] Add Reply Success',
  AddReplyFailure = '[Radio] Add Reply Failure',

  UpdateRadioProperty = '[Radio] Update Radio Property',
  UpdateRadioPropertySuccess = '[Radio] Update Radio Property Success',
  UpdateRadioPropertyFailure = 'Update Radio Property Failure',

  DeleteRadioProperty = '[Radio] Delete Radio Property',
  DeleteRadioPropertySuccess = '[Radio] Delete Radio Property Success',
  DeleteRadioPropertyFailure = '[Radio] Delete Radio Property Failure',
}

export class LoadRadios implements Action {
  readonly type = RadioActionTypes.LoadRadios;
  constructor(public payload: RadioEntitiesHttpParams) {}
}

export class LoadRadiosSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadiosSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class LoadRadiosFailure implements Action {
  readonly type = RadioActionTypes.LoadRadiosFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class LoadRadio implements Action {
  readonly type = RadioActionTypes.LoadRadio;
  constructor(public payload: string) {}
}

export class LoadRadioSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadioSuccess;
  constructor(public payload: RadioDetail) {}
}

export class LoadRadioFailure implements Action {
  readonly type = RadioActionTypes.LoadRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class AddRadioEntity implements Action {
  readonly type = RadioActionTypes.AddRadio;
  constructor(public payload: RadioApiRequest) {}
}

export class AddRadioEntitySuccess implements Action {
  readonly type = RadioActionTypes.AddRadioSuccess;
  constructor(public payload: RadioEntity) {}
}

export class AddRadioEntityFailure implements Action {
  readonly type = RadioActionTypes.AddRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class AddReply implements Action {
  readonly type = RadioActionTypes.AddReply;
  constructor(public payload: {entity: ReplyApiRequest, id: string}) {}
}

export class AddReplySuccess implements Action {
  readonly type = RadioActionTypes.AddReplySuccess;
  constructor(public payload: RadioDetail) {}
}

export class AddReplyFailure implements Action {
  readonly type = RadioActionTypes.AddReplyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class UpdateRadioProperty implements Action {
  readonly type = RadioActionTypes.UpdateRadioProperty;
  constructor(public payload: { radioId: string, customPropertyId: string, data: any }) {}
}

export class UpdateRadioPropertySuccess implements Action {
  readonly type = RadioActionTypes.UpdateRadioPropertySuccess;
  constructor(public payload: RadioDetail) {}
}

export class UpdateRadioPropertyFailure implements Action {
  readonly type = RadioActionTypes.UpdateRadioPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class DeleteRadioProperty implements Action {
  readonly type = RadioActionTypes.DeleteRadioProperty;
  constructor(public payload: { radioId: string, customPropertyId: string }) {}
}

export class DeleteRadioPropertySuccess implements Action {
  readonly type = RadioActionTypes.DeleteRadioPropertySuccess;
  constructor(public payload: RadioDetail) {}
}

export class DeleteRadioPropertyFailure implements Action {
  readonly type = RadioActionTypes.DeleteRadioPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type RadioActionsUnion = 
  | LoadRadios
  | LoadRadiosSuccess
  | LoadRadiosFailure
  | LoadRadio
  | LoadRadioSuccess
  | LoadRadioFailure
  | AddRadioEntity
  | AddRadioEntitySuccess
  | AddRadioEntityFailure
  | AddReply
  | AddReplySuccess
  | AddReplyFailure
  | UpdateRadioProperty
  | UpdateRadioPropertySuccess
  | UpdateRadioPropertyFailure
  | DeleteRadioProperty
  | DeleteRadioPropertySuccess
  | DeleteRadioPropertyFailure;


