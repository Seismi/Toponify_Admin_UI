import { Action } from '@ngrx/store';
import { Radio, AddRadioApiRequest, AddReplyRadioApiRequest, ArchiveRadioApiRequest, Replies } from '../models/radio.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum RadioActionTypes {
  LoadRadio = '[Radio] Load Radio',
  LoadRadioSuccess = '[Radio] Load Radio Success',
  LoadRadioFail = '[Radio] Load Radio Fail',
  LoadReplyRadio = '[Radio] Load Reply Radio',
  LoadReplyRadioSuccess = '[Radio] Load Reply Radio Success',
  LoadReplyRadioFail = '[Radio] Load Reply Radio Fail',
  AddRadio = '[Radio] Add Radio',
  AddRadioSuccess = '[Radio] Add Radio Success',
  AddRadioFail = '[Radio] Add Radio Fail',
  ReplyRadio = '[Radio] Reply Radio',
  ReplyRadioSuccess = '[Radio] Reply Radio Success',
  ReplyRadioFail = '[Radio] Reply Radio Fail',
  ArchiveRadio = '[Radio] Archive Radio',
  ArchiveRadioSuccess = '[Radio] Archive Radio Success',
  ArchiveRadioFail = '[Radio] Archive Radio Fail'
}

export class LoadRadio implements Action {
  readonly type = RadioActionTypes.LoadRadio;
  constructor() {}
}

export class LoadRadioSuccess implements Action {
  readonly type = RadioActionTypes.LoadRadioSuccess;
  constructor(public payload: Radio[]) {}
}

export class LoadRadioFail implements Action {
  readonly type = RadioActionTypes.LoadRadioFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadReplyRadio implements Action {
  readonly type = RadioActionTypes.LoadReplyRadio;
  constructor(public payload: any) {}
}

export class LoadReplyRadioSuccess implements Action {
  readonly type = RadioActionTypes.LoadReplyRadioSuccess;
  constructor(public payload: any) {}
}

export class LoadReplyRadioFail implements Action {
  readonly type = RadioActionTypes.LoadReplyRadioFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddRadio implements Action {
  readonly type = RadioActionTypes.AddRadio;
  constructor(public payload: any) {}
}

export class AddRadioSuccess implements Action {
  readonly type = RadioActionTypes.AddRadioSuccess;
  constructor(public payload: any) {}
}

export class AddRadioFail implements Action {
  readonly type = RadioActionTypes.AddRadioFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ReplyRadio implements Action {
  readonly type = RadioActionTypes.ReplyRadio;
  constructor(public payload: any) {}
}

export class ReplyRadioSuccess implements Action {
  readonly type = RadioActionTypes.ReplyRadioSuccess;
  constructor(public payload: any) {}
}

export class ReplyRadioFail implements Action {
  readonly type = RadioActionTypes.ReplyRadioFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ArchiveRadio implements Action {
  readonly type = RadioActionTypes.ArchiveRadio;
  constructor(public payload: any) {}
}

export class ArchiveRadioSuccess implements Action {
  readonly type = RadioActionTypes.ArchiveRadioSuccess;
  constructor(public payload: any) {}
}

export class ArchiveRadioFail implements Action {
  readonly type = RadioActionTypes.ArchiveRadioFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type RadioActionsUnion = 
  | LoadRadio
  | LoadRadioSuccess
  | LoadRadioFail
  | AddRadio
  | AddRadioSuccess
  | AddRadioFail
  | ReplyRadio
  | ReplyRadioSuccess
  | ReplyRadioFail
  | ArchiveRadio
  | ArchiveRadioSuccess
  | ArchiveRadioFail
  | LoadReplyRadio
  | LoadReplyRadioSuccess
  | LoadReplyRadioFail;


