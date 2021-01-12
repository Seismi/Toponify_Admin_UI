import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  OpenLeftDrawer = '[Layout] Open Left Drawer',
  CloseLeftDrawer = '[Layout] Close Left Drawer',
  SelectLeftDrawerTab = '[Layout] Select left drawer tab'
}

export class OpenLeftDrawer implements Action {
  readonly type = LayoutActionTypes.OpenLeftDrawer;
}

export class CloseLeftDrawer implements Action {
  readonly type = LayoutActionTypes.CloseLeftDrawer;
}

export class SelectLeftDrawerTab implements Action {
  readonly type = LayoutActionTypes.SelectLeftDrawerTab;
  constructor(public payload: string) {}
}

export type LayoutActionsUnion =
  | OpenLeftDrawer
  | CloseLeftDrawer
  | SelectLeftDrawerTab;