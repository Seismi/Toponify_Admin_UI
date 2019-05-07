import { Action } from '@ngrx/store';

export enum ViewActionTypes {
  ZoomModel = '[View] Zoom Level',
  ViewModel = '[View] View level'
}

export class SetViewLevel implements Action {
  readonly type = ViewActionTypes.ViewModel;
  constructor(public payload: number) {}
}

export class SetZoomLevel implements Action {
  readonly type = ViewActionTypes.ZoomModel;
  constructor(public payload: number) {}
}

export type ViewActionsUnion = SetViewLevel | SetZoomLevel;
