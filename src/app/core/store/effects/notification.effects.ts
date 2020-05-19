import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  NotificationActionTypes,
  NotificationDelete,
  NotificationDeleteSuccess,
  NotificationGetAllSuccess,
  NotificationMarkAsRead,
  NotificationMarkAsReadSuccess,
  NotificationSetError,
  NotificationMarkAllAsRead,
  NotificationMarkAllAsReadSuccess,
  NotificationDeleteAll,
  NotificationDeleteAllSuccess
} from '../actions/notification.actions';
import {
  NotificationDeleteResponseSuccess,
  NotificationGetAllResponseSuccess,
  NotificationMarkAsReadResponseSuccess
} from '../models/notification.models';

@Injectable()
export class NotificationEffects {
  constructor(private actions$: Actions, private notificationService: NotificationService) {}

  @Effect()
  getAll$ = this.actions$.pipe(
    ofType(NotificationActionTypes.GetAll),
    switchMap(() => {
      return this.notificationService.getAll().pipe(
        switchMap((response: NotificationGetAllResponseSuccess) => {
          return [new NotificationGetAllSuccess(response.data)];
        }),
        catchError((error: HttpErrorResponse) => of(new NotificationSetError(error)))
      );
    })
  );

  @Effect()
  markAsRead$ = this.actions$.pipe(
    ofType<NotificationMarkAsRead>(NotificationActionTypes.MarkAsRead),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.notificationService.markAsRead(id).pipe(
        switchMap((response: NotificationMarkAsReadResponseSuccess) => [
          new NotificationMarkAsReadSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new NotificationSetError(error)))
      );
    })
  );

  @Effect()
  delete$ = this.actions$.pipe(
    ofType<NotificationDelete>(NotificationActionTypes.Delete),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.notificationService.delete(id).pipe(
        switchMap((response: NotificationDeleteResponseSuccess) => [new NotificationDeleteSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new NotificationSetError(error)))
      );
    })
  );

  @Effect()
  markAllAsRead$ = this.actions$.pipe(
    ofType<NotificationMarkAllAsRead>(NotificationActionTypes.MarkAllAsRead),
    switchMap(_ => {
      return this.notificationService.markAllAsRead().pipe(
        switchMap((payload: NotificationGetAllResponseSuccess) => [
          new NotificationMarkAllAsReadSuccess(payload.data),
          new NotificationGetAllSuccess(payload.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new NotificationSetError(error)))
      );
    })
  );

  @Effect()
  deleteAll$ = this.actions$.pipe(
    ofType<NotificationDeleteAll>(NotificationActionTypes.DeleteAll),
    map(action => action),
    switchMap(_ => {
      return this.notificationService.deleteAll().pipe(
        switchMap(() => [new NotificationDeleteAllSuccess()]),
        catchError((error: HttpErrorResponse) => of(new NotificationSetError(error)))
      );
    })
  );
}
