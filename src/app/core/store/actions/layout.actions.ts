import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  OpenLeftDrawer = '[Layout] Open Left Drawer',
  CloseLeftDrawer = '[Layout] Close Left Drawer',
  OpenRightDrawer = '[Layout] Open Right Drawer',
  CloseRightDrawer = '[Layout] Close Right Drawer',
  SelectLeftDrawerTab = '[Layout] Select left drawer tab'
}

export class OpenLeftDrawer implements Action {
  readonly type = LayoutActionTypes.OpenLeftDrawer;
}

export class CloseLeftDrawer implements Action {
  readonly type = LayoutActionTypes.CloseLeftDrawer;
}

export class OpenRightDrawer implements Action {
  readonly type = LayoutActionTypes.OpenRightDrawer;
}

export class CloseRightDrawer implements Action {
  readonly type = LayoutActionTypes.CloseRightDrawer;
}
export class SelectLeftDrawerTab implements Action {
  readonly type = LayoutActionTypes.SelectLeftDrawerTab;
  constructor(public payload: any) {}
}

export type LayoutActionsUnion =
  | OpenLeftDrawer
  | CloseLeftDrawer
  | OpenRightDrawer
  | CloseRightDrawer
  | SelectLeftDrawerTab;
