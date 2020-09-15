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
  DeleteScopeFailure = '[Scope] Delete Scope entity Failure',

  AddScopeNodes = '[Scope] Add Scope Nodes',
  AddScopeNodesSuccess = '[Scope] Add Scope Nodes Success',
  AddScopeNodesFailure = '[Scope] Add Scope Nodes Failure',

  SetScopeAsFavourite = '[Scope] set scope as favourite',
  SetScopeAsFavouriteSuccess = '[Scope] set scope as favourite success',
  SetScopeAsFavouriteFailure = '[Scope] set scope as favourite failure',

  UnsetScopeAsFavourite = '[Scope] unset scope as favourite',
  UnsetScopeAsFavouriteSuccess = '[Scope] unset scope as favourite success',
  UnsetScopeAsFavouriteFailure = '[Scope] unset scope as favourite failure',

  SetPreferredLayout = '[Scope] Set Preferred Layout',
  SetPreferredLayoutSuccess = '[Scope] Set Preferred Layout Success',
  SetPreferredLayoutFailure = '[Scope] Set Preferred Layout Failure',

  UnsetPreferredLayout = '[Scope] Unset Preferred Layout',
  UnsetPreferredLayoutSuccess = '[Scope] Unset Preferred Layout Success',
  UnsetPreferredLayoutFailure = '[Scope] Unset Preferred Layout Failure'
}

export class LoadScopes implements Action {
  readonly type = ScopeActionTypes.LoadScopes;
  constructor(public payload: ScopeEntitiesHttpParams) {}
}

export class LoadScopesSuccess implements Action {
  readonly type = ScopeActionTypes.LoadScopesSuccess;
  constructor(public payload: GetScopeEntitiesApiResponse) {}
}

export class LoadScopesFailure implements Action {
  readonly type = ScopeActionTypes.LoadScopesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadScope implements Action {
  readonly type = ScopeActionTypes.LoadScope;
  constructor(public payload: string) {}
}

export class LoadScopeSuccess implements Action {
  readonly type = ScopeActionTypes.LoadScopeSuccess;
  constructor(public payload: GetScopeApiResponse) {}
}

export class LoadScopeFailure implements Action {
  readonly type = ScopeActionTypes.LoadScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddScope implements Action {
  readonly type = ScopeActionTypes.AddScope;
  constructor(public payload: ScopeDetails) {}
}

export class AddScopeSuccess implements Action {
  readonly type = ScopeActionTypes.AddScopeSuccess;
  constructor(public payload: AddScopeApiResponse) {}
}

export class AddScopeFailure implements Action {
  readonly type = ScopeActionTypes.AddScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateScope implements Action {
  readonly type = ScopeActionTypes.UpdateScope;
  constructor(public payload: { id: string; data: ScopeDetails }) {}
}

export class UpdateScopeSuccess implements Action {
  readonly type = ScopeActionTypes.UpdateScopeSuccess;
  constructor(public payload: UpdateScopeApiResponse) {}
}

export class UpdateScopeFailure implements Action {
  readonly type = ScopeActionTypes.UpdateScopeFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
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

export class AddScopeNodes implements Action {
  readonly type = ScopeActionTypes.AddScopeNodes;
  constructor(public payload: { scopeId: string, data: string[] }) {}
}

export class AddScopeNodesSuccess implements Action {
  readonly type = ScopeActionTypes.AddScopeNodesSuccess;
  constructor(public payload: AddScopeApiResponse) {}
}

export class AddScopeNodesFailure implements Action {
  readonly type = ScopeActionTypes.AddScopeNodesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SetScopeAsFavourite implements Action {
  readonly type = ScopeActionTypes.SetScopeAsFavourite;
  constructor(public payload: string) {}
}

export class SetScopeAsFavouriteSuccess implements Action {
  readonly type = ScopeActionTypes.SetScopeAsFavouriteSuccess;
  constructor(public payload: string) {}
}

export class SetScopeAsFavouriteFailure implements Action {
  readonly type = ScopeActionTypes.SetScopeAsFavouriteFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UnsetScopeAsFavourite implements Action {
  readonly type = ScopeActionTypes.UnsetScopeAsFavourite;
  constructor(public payload: string) {}
}

export class UnsetScopeAsFavouriteSuccess implements Action {
  readonly type = ScopeActionTypes.UnsetScopeAsFavouriteSuccess;
  constructor(public payload: string) {}
}

export class UnsetScopeAsFavouriteFailure implements Action {
  readonly type = ScopeActionTypes.UnsetScopeAsFavouriteFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SetPreferredLayout implements Action {
  readonly type = ScopeActionTypes.SetPreferredLayout;
  constructor(public payload: { scopeId: string, layoutId: string }) {}
}

export class SetPreferredLayoutSuccess implements Action {
  readonly type = ScopeActionTypes.SetPreferredLayoutSuccess;
  constructor(public payload: ScopeDetails) {}
}

export class SetPreferredLayoutFailure implements Action {
  readonly type = ScopeActionTypes.SetPreferredLayoutFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UnsetPreferredLayout implements Action {
  readonly type = ScopeActionTypes.UnsetPreferredLayout;
  constructor(public payload: { scopeId: string }) {}
}

export class UnsetPreferredLayoutSuccess implements Action {
  readonly type = ScopeActionTypes.UnsetPreferredLayoutSuccess;
  constructor(public payload: ScopeDetails) {}
}

export class UnsetPreferredLayoutFailure implements Action {
  readonly type = ScopeActionTypes.UnsetPreferredLayoutFailure;
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
  | AddScopeNodes
  | AddScopeNodesSuccess
  | AddScopeNodesFailure
  | SetScopeAsFavourite
  | SetScopeAsFavouriteFailure
  | SetScopeAsFavouriteSuccess
  | UnsetScopeAsFavourite
  | UnsetScopeAsFavouriteSuccess
  | UnsetScopeAsFavouriteFailure
  | SetPreferredLayout
  | SetPreferredLayoutSuccess
  | SetPreferredLayoutFailure
  | UnsetPreferredLayout
  | UnsetPreferredLayoutSuccess
  | UnsetPreferredLayoutFailure;
