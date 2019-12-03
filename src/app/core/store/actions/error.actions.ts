import { Action } from '@ngrx/store';

export enum ErrorActionTypes {
  ShowError = '[Error] Show Error'
}

export class ShowError implements Action {
  readonly type = ErrorActionTypes.ShowError;
  constructor(public payload: string) {}
}

export type ErrorActionsUnion = ShowError;
