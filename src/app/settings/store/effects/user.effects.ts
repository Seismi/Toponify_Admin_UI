import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import { UserActionTypes } from '../actions/user.actions';
import { switchMap, catchError, map, exhaustMap } from 'rxjs/operators';
import { UserApiResponse, UpdateUserApiRequest, UpdateUserApiResponse, AddUserApiRequest, AddUserApiResponse } from '../models/user.model';
import * as UserActions from '../actions/user.actions';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private userService: UserService) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType<UserActions.LoadUsers>(UserActionTypes.LoadUsers),
    switchMap(_ => {
      return this.userService.getUsers().pipe(
        switchMap((users: UserApiResponse) => [new UserActions.LoadUsersSuccess(users.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.LoadUsersFailure(error)))
      );
    })
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType<UserActions.UpdateUser>(UserActionTypes.UpdateUser),
    map(action => action.payload),
    exhaustMap((payload: UpdateUserApiRequest) => {
      return this.userService.updateUser(payload).pipe(
        switchMap((user: UpdateUserApiResponse) => [new UserActions.UpdateUserSuccess(user.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.UpdateUserFailure(error)))
      );
    })
  );

  @Effect()
  addUser$ = this.actions$.pipe(
    ofType<UserActions.AddUser>(UserActionTypes.AddUser),
    map(action => action.payload),
    exhaustMap((payload: AddUserApiRequest) => {
      return this.userService.addUser(payload).pipe(
        switchMap((user: AddUserApiResponse) => [new UserActions.AddUserSuccess(user.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.AddUserFailure(error)))
      );
    })
  );
}