import { Action } from '@ngrx/store';
import { Level } from '@app/architecture/services/diagram-level.service';

export enum ViewActionTypes {
  ZoomModel = '[View] Zoom Level',
  ViewModel = '[View] View level'
}

export class SetViewLevel implements Action {
  readonly type = ViewActionTypes.ViewModel;
  constructor(public payload: Level) {}
}

export class SetZoomLevel implements Action {
  readonly type = ViewActionTypes.ZoomModel;
  constructor(public payload: number) {}
}

export type ViewActionsUnion = SetViewLevel | SetZoomLevel;
