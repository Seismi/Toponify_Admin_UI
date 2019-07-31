import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { 
  UsersApiResponse, 
  UserDetails, 
  UserEntitiesHttpParams, 
  User, 
  RolesEntity
} from '../models/user.model';


export enum UserActionTypes {
  LoadUsers = '[User] Load Users',
  LoadUsersSuccess = '[User] Load Users Success',
  LoadUsersFailure = '[User] Load Users Fail',

  LoadUser = '[User] Load User',
  LoadUserSuccess = '[User] Load User Success',
  LoadUserFailure = '[User] Load User Fail',

  AddUser = '[User] Add User entity',
  AddUserSuccess = '[User] Add User entity Success',
  AddUserFailure = '[User] Add User entity Failure',

  UpdateUser = '[User] Update User entity',
  UpdateUserSuccess = '[User] Update User entity Success',
  UpdateUserFailure = '[User] Update User entity Failure',

  DeleteUser = '[User] Delete User entity',
  DeleteUserSuccess = '[User] Delete User entity Success',
  DeleteUserFailure = '[User] Delete User entity Failure',

  LoadUserRoles = '[User] Load Roles',
  LoadUserRolesSuccess = '[User] Load Roles Success',
  LoadUserRolesFailure = '[User] Load Roles Fail'
}

export class LoadUsers implements Action {
  readonly type = UserActionTypes.LoadUsers;
  constructor(public payload: UserEntitiesHttpParams) { }
}

export class LoadUsersSuccess implements Action {
  readonly type = UserActionTypes.LoadUsersSuccess;
  constructor(public payload: UsersApiResponse) { }
}

export class LoadUsersFailure implements Action {
  readonly type = UserActionTypes.LoadUsersFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class LoadUser implements Action {
  readonly type = UserActionTypes.LoadUser;
  constructor(public payload: string) { }
}

export class LoadUserSuccess implements Action {
  readonly type = UserActionTypes.LoadUserSuccess;
  constructor(public payload: User) { }
}

export class LoadUserFailure implements Action {
  readonly type = UserActionTypes.LoadUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class AddUser implements Action {
  readonly type = UserActionTypes.AddUser;
  constructor(public payload: UserDetails) { }
}

export class AddUserSuccess implements Action {
  readonly type = UserActionTypes.AddUserSuccess;
  constructor(public payload: any) { }
}

export class AddUserFailure implements Action {
  readonly type = UserActionTypes.AddUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class UpdateUser implements Action {
  readonly type = UserActionTypes.UpdateUser;
  constructor(public payload: {id: string, data: UserDetails}) { }
}

export class UpdateUserSuccess implements Action {
  readonly type = UserActionTypes.UpdateUserSuccess;
  constructor(public payload: User) { }
}

export class UpdateUserFailure implements Action {
  readonly type = UserActionTypes.UpdateUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class DeleteUser implements Action {
  readonly type = UserActionTypes.DeleteUser;
  constructor(public payload: string) {}
}

export class DeleteUserSuccess implements Action {
  readonly type = UserActionTypes.DeleteUserSuccess;
  constructor(public payload: any) {}
}

export class DeleteUserFailure implements Action {
  readonly type = UserActionTypes.DeleteUserFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class LoadUserRoles implements Action {
  readonly type = UserActionTypes.LoadUserRoles;
  constructor() { }
}

export class LoadUserRolesSuccess implements Action {
  readonly type = UserActionTypes.LoadUserRolesSuccess;
  constructor(public payload: RolesEntity[]) { }
}

export class LoadUserRolesFailure implements Action {
  readonly type = UserActionTypes.LoadUserRolesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export type UserActionsUnion =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFailure
  | LoadUser
  | LoadUserSuccess
  | LoadUserFailure
  | AddUser
  | AddUserSuccess
  | AddUserFailure
  | UpdateUser
  | UpdateUserSuccess
  | UpdateUserFailure
  | DeleteUser
  | DeleteUserSuccess
  | DeleteUserFailure
  | LoadUserRoles
  | LoadUserRolesSuccess
  | LoadUserRolesFailure;
