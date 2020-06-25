import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import * as UserActions from '../actions/user.actions';
import { UserActionTypes } from '../actions/user.actions';
import {
  UserDetails,
  UserEntitiesHttpParams,
  UsersApiResponse,
  UserDetailResponse,
  UserRolesApiResponse,
  UpdateUserApiResponse,
  UserPassword
} from '../models/user.model';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType<UserActions.LoadUsers>(UserActionTypes.LoadUsers),
    map(action => action.payload),
    switchMap((payload: UserEntitiesHttpParams) => {
      return this.userService.getUsers(payload).pipe(
        switchMap((resp: UsersApiResponse) => [new UserActions.LoadUsersSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.LoadUsersFailure(error)))
      );
    })
  );

  @Effect()
  loadUserRoles$ = this.actions$.pipe(
    ofType<UserActions.LoadUserRoles>(UserActionTypes.LoadUserRoles),
    switchMap(_ => {
      return this.userService.getUserRoles().pipe(
        switchMap((response: UserRolesApiResponse) => [new UserActions.LoadUserRolesSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.LoadUserRolesFailure(error)))
      );
    })
  );

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType<UserActions.LoadUser>(UserActionTypes.LoadUser),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.userService.getUser(payload).pipe(
        switchMap((user: UserDetailResponse) => [new UserActions.LoadUserSuccess(user.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.LoadUserFailure(error)))
      );
    })
  );

  @Effect()
  addUser$ = this.actions$.pipe(
    ofType<UserActions.AddUser>(UserActionTypes.AddUser),
    map(action => action.payload),
    switchMap((payload: UserDetails) => {
      return this.userService.addUser(payload).pipe(
        switchMap((resp: any) => [new UserActions.AddUserSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.AddUserFailure(error)))
      );
    })
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType<UserActions.UpdateUser>(UserActionTypes.UpdateUser),
    map(action => action.payload),
    switchMap((payload: { id: string; data: UserDetails }) => {
      return this.userService.updateUser(payload.id, payload.data).pipe(
        switchMap((response: UpdateUserApiResponse) => [new UserActions.UpdateUserSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.UpdateUserFailure(error)))
      );
    })
  );

  @Effect()
  deleteUser$ = this.actions$.pipe(
    ofType<UserActions.DeleteUser>(UserActionTypes.DeleteUser),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.userService.deleteUser(id).pipe(
        switchMap(_ => [new UserActions.DeleteUserSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.DeleteUserFailure(error)))
      );
    })
  );

  @Effect()
  updateUserPassword$ = this.actions$.pipe(
    ofType<UserActions.UpdateUserPassword>(UserActionTypes.UpdateUserPassword),
    map(action => action.payload),
    switchMap((payload: UserPassword) => {
      return this.userService.updateUserPassword(payload).pipe(
        switchMap((response: any) => [new UserActions.UpdateUserPasswordSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.UpdateUserPasswordFailure(error)))
      );
    })
  );

  @Effect()
  addUserTeam$ = this.actions$.pipe(
    ofType<UserActions.AddUserTeam>(UserActionTypes.AddUserTeam),
    map(action => action.payload),
    switchMap((payload: { userId: string, teamId: string }) => {
      return this.userService.addUserTeam(payload.userId, payload.teamId).pipe(
        switchMap((resp: UserDetailResponse) => [new UserActions.AddUserTeamSuccess(resp.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.AddUserTeamFailure(error)))
      );
    })
  );

  @Effect()
  deleteUserTeam$ = this.actions$.pipe(
    ofType<UserActions.DeleteUserTeam>(UserActionTypes.DeleteUserTeam),
    map(action => action.payload),
    switchMap((payload: { userId: string, teamId: string }) => {
      return this.userService.deleteUserTeam(payload.userId, payload.teamId).pipe(
        switchMap(_ => [
          new UserActions.DeleteUserTeamSuccess(payload.teamId),
          new UserActions.LoadUser(payload.userId)
        ]),
        catchError((error: HttpErrorResponse) => of(new UserActions.DeleteUserTeamFailure(error)))
      );
    })
  );

  @Effect()
  addUserRole$ = this.actions$.pipe(
    ofType<UserActions.AddUserRole>(UserActionTypes.AddUserRole),
    map(action => action.payload),
    switchMap((payload: { userId: string, roleId: string }) => {
      return this.userService.addUserRole(payload.userId, payload.roleId).pipe(
        switchMap((resp: UserDetailResponse) => [new UserActions.AddUserRoleSuccess(resp.data)]),
        catchError((error: HttpErrorResponse) => of(new UserActions.AddUserRoleFailure(error)))
      );
    })
  );

  @Effect()
  deleteUserRole$ = this.actions$.pipe(
    ofType<UserActions.DeleteUserRole>(UserActionTypes.DeleteUserRole),
    map(action => action.payload),
    switchMap((payload: { userId: string, roleId: string }) => {
      return this.userService.deleteUserRole(payload.userId, payload.roleId).pipe(
        switchMap(_ => [
          new UserActions.DeleteUserRoleSuccess(payload.roleId),
          new UserActions.LoadUser(payload.userId)
        ]),
        catchError((error: HttpErrorResponse) => of(new UserActions.DeleteUserRoleFailure(error)))
      );
    })
  );
}
