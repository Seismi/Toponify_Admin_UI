import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { 
  ScopeEntitiesHttpParams, 
  GetScopeEntitiesApiResponse, 
  GetScopeApiResponse, 
  ScopeDetails, 
  AddScopeApiResponse, 
  UpdateScopeApiResponse 
} from '../models/scope.model';


export enum ScopeActionTypes {
  LoadScopes = '[Scope] Load Scopes',
  LoadScopesSuccess = '[Scope] Load Scopes Success',
  LoadScopesFailure = '[Scope] Load Scopes Fail',

  LoadScope = '[Scope] Load Scope',
  LoadScopeSuccess = '[Scope] Load Scope Success',
  LoadScopeFailure = '[Scope] Load Scope Fail',

  AddScope = '[Scope] Add Scope entity',
  AddScopeSuccess = '[Scope] Add Scope entity Success',
  AddScopeFailure = '[Scope] Add Scope entity Failure',

  UpdateScope = '[Scope] Update Scope entity',
  UpdateScopeSuccess = '[Scope] Update Scope entity Success',
  UpdateScopeFailure = '[Scope] Update Scope entity Failure',

  DeleteScope = '[Scope] Delete Scope entity',
  DeleteScopeSuccess = '[Scope] Delete Scope entity Success',
  DeleteScopeFailure = '[Scope] Delete Scope entity Failure'
}

export class LoadScopes implements Action {
  readonly type = ScopeActionTypes.LoadScopes;
  constructor(public payload: ScopeEntitiesHttpParams) { }
}

export class LoadScopesSuccess implements Action {
  readonly type = ScopeActionTypes.LoadScopesSuccess;
  constructor(public payload: GetScopeEntitiesApiResponse) { }
}

export class LoadScopesFailure implements Action {
  readonly type = ScopeActionTypes.LoadScopesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class LoadScope implements Action {
  readonly type = ScopeActionTypes.LoadScope;
  constructor(public payload: string) { }
}

export class LoadScopeSuccess implements Action {
  readonly type = ScopeActionTypes.LoadScopeSuccess;
  constructor(public payload: GetScopeApiResponse) { }
}

export class LoadScopeFailure implements Action {
  readonly type = ScopeActionTypes.LoadScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class AddScope implements Action {
  readonly type = ScopeActionTypes.AddScope;
  constructor(public payload: ScopeDetails) { }
}

export class AddScopeSuccess implements Action {
  readonly type = ScopeActionTypes.AddScopeSuccess;
  constructor(public payload: AddScopeApiResponse) { }
}

export class AddScopeFailure implements Action {
  readonly type = ScopeActionTypes.AddScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class UpdateScope implements Action {
  readonly type = ScopeActionTypes.UpdateScope;
  constructor(public payload: {id: string, data: ScopeDetails}) { }
}

export class UpdateScopeSuccess implements Action {
  readonly type = ScopeActionTypes.UpdateScopeSuccess;
  constructor(public payload: UpdateScopeApiResponse) { }
}

export class UpdateScopeFailure implements Action {
  readonly type = ScopeActionTypes.UpdateScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class DeleteScope implements Action {
  readonly type = ScopeActionTypes.DeleteScope;
  constructor(public payload: string) {}
}

export class DeleteScopeSuccess implements Action {
  readonly type = ScopeActionTypes.DeleteScopeSuccess;
  constructor(public payload: any) {}
}

export class DeleteScopeFailure implements Action {
  readonly type = ScopeActionTypes.DeleteScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type ScopeActionsUnion =
  | LoadScopes
  | LoadScopesSuccess
  | LoadScopesFailure
  | LoadScope
  | LoadScopeSuccess
  | LoadScopeFailure
  | AddScope
  | AddScopeSuccess
  | AddScopeFailure
  | UpdateScope
  | UpdateScopeSuccess
  | UpdateScopeFailure
  | DeleteScope
  | DeleteScopeSuccess
  | DeleteScopeFailure
  ;