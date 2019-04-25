import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { User, UpdateUserApiRequest, AddUserApiRequest } from '../models/user.model';

export enum UserActionTypes {
  LoadUsers = '[User] Load Users',
  LoadUsersSuccess = '[User] Load Users Success',
  LoadUsersFailure = '[User] Load Users Fail',
  UpdateUser = '[User] Update User',
  UpdateUserSuccess = '[User] Update User Success',
  UpdateUserFailure = '[User] Update User Failure',
  AddUser = '[Version] Add User',
  AddUserSuccess = '[Version] Add User Success',
  AddUserFailure = '[Version] Add User Failure',
}


export class LoadUsers implements Action {
  readonly type = UserActionTypes.LoadUsers;
  constructor() {}
}

export class LoadUsersSuccess implements Action {
  readonly type = UserActionTypes.LoadUsersSuccess;
  constructor(public payload: User[]) {}
}

export class LoadUsersFailure implements Action {
  readonly type = UserActionTypes.LoadUsersFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: UpdateUserApiRequest) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserSuccess;
  constructor(public payload: User) {}
}

export class UpdateUserFailure implements Action {
  readonly type = UserActionTypes.UpdateUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddUser implements Action {
  readonly type = UserActionTypes.AddUser;
  constructor(public payload: AddUserApiRequest) {}
}

export class AddUserSuccess implements Action {
  readonly type = UserActionTypes.AddUserSuccess;
  constructor(public payload: User) {}
}

export class AddUserFailure implements Action {
  readonly type = UserActionTypes.AddUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type UserActionsUnion =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFailure
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFailure
  | AddUser
  | AddUserSuccess
  | AddUserFailure;