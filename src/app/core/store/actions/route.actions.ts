import { Action } from '@ngrx/store';
import { Params } from '@angular/router';

export enum RouteActionTypes {
  UpdateQueryParams = '[Route] Update query params',
  ResetQueryParams = '[Route] reset query params'
}

export class UpdateQueryParams implements Action {
  readonly type = RouteActionTypes.UpdateQueryParams;
  constructor(public payload: Params) {}
}

export class ResetQueryParams implements Action {
  readonly type = RouteActionTypes.ResetQueryParams;
  constructor(public payload?: Params) {}
}

export type RouteActionsUnion = UpdateQueryParams | ResetQueryParams;
