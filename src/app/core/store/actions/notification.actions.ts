import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Notification } from '../models/notification.models';

export enum NotificationActionTypes {
  GetAll = '[Notification] get all',
  GetAllSuccess = '[Notification] get all success',
  Delete = '[Notification] delete',
  DeleteSuccess = '[Notification] delete success',
  MarkAsRead = '[Notification] mark as read',
  MarkAsReadSuccess = '[Notification] mark as read success',
  SetError = '[Notification] set error',
  SetOpen = '[Notification] set open',
  DeleteApiError = '[Notification] delete api error',
  MarkAllAsRead = '[Notification] mark all as read',
  MarkAllAsReadSuccess = '[Notification] mark all as read success',
  DeleteAll = '[Notification] delete all',
  DeleteAllSuccess = '[Notification] delete all success',
}

export class NotificationGetAll implements Action {
  readonly type = NotificationActionTypes.GetAll;
  constructor() {}
}

export class NotificationGetAllSuccess implements Action {
  readonly type = NotificationActionTypes.GetAllSuccess;
  constructor(public payload: Notification[]) {}
}

export class NotificationMarkAsRead implements Action {
  readonly type = NotificationActionTypes.MarkAsRead;
  constructor(public payload: string) {}
}

export class NotificationMarkAsReadSuccess implements Action {
  readonly type = NotificationActionTypes.MarkAsReadSuccess;
  constructor(public payload: Notification) {}
}

export class NotificationDelete implements Action {
  readonly type = NotificationActionTypes.Delete;
  constructor(public payload: string) {}
}

export class NotificationDeleteSuccess implements Action {
  readonly type = NotificationActionTypes.DeleteSuccess;
  constructor(public payload: string) {}
}

export class NotificationSetError implements Action {
  readonly type = NotificationActionTypes.SetError;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class NotificationDeleteApiError implements Action {
  readonly type = NotificationActionTypes.DeleteApiError;
  constructor() {}
}

export class NotificationPanelOpen implements Action {
  readonly type = NotificationActionTypes.SetOpen;
  constructor(public payload: boolean) {}
}

export class NotificationMarkAllAsRead implements Action {
  readonly type = NotificationActionTypes.MarkAllAsRead;
  constructor() {}
}

export class NotificationMarkAllAsReadSuccess implements Action {
  readonly type = NotificationActionTypes.MarkAllAsReadSuccess;
  constructor(payload: Notification[]) {}
}

export class NotificationDeleteAll implements Action {
  readonly type = NotificationActionTypes.DeleteAll;
  constructor() {}
}

export class NotificationDeleteAllSuccess implements Action {
  readonly type = NotificationActionTypes.DeleteAllSuccess;
  constructor() {}
}

export type NotificationActionsUnion =
  | NotificationGetAll
  | NotificationGetAllSuccess
  | NotificationMarkAsRead
  | NotificationMarkAsReadSuccess
  | NotificationDelete
  | NotificationDeleteSuccess
  | NotificationDeleteApiError
  | NotificationSetError
  | NotificationPanelOpen
  | NotificationMarkAllAsRead
  | NotificationMarkAllAsReadSuccess
  | NotificationDeleteAll
  | NotificationDeleteAllSuccess;
