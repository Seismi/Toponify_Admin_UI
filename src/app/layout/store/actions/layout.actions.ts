
import { Action } from '@ngrx/store';
import { LayoutEntitiesHttpParams, GetLayoutEntitiesApiResponse, GetLayoutApiResponse, LayoutDetails,
   AddLayoutApiResponse, UpdateLayoutApiResponse } from '../models/layout.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum LayoutActionTypes {
  LoadLayouts = '[Layout] Load Layouts',
  LoadLayoutsSuccess = '[Layout] Load Layouts Success',
  LoadLayoutsFailure = '[Layout] Load Layouts Fail',

  LoadLayout = '[Layout] Load Layout',
  LoadLayoutSuccess = '[Layout] Load Layout Success',
  LoadLayoutFailure = '[Layout] Load Layout Fail',

  AddLayout = '[Layout] Add Layout entity',
  AddLayoutSuccess = '[Layout] Add Layout entity Success',
  AddLayoutFailure = '[Layout] Add Layout entity Failure',

  UpdateLayout = '[Layout] Update Layout entity',
  UpdateLayoutSuccess = '[Layout] Update Layout entity Success',
  UpdateLayoutFailure = '[Layout] Update Layout entity Failure',

  DeleteLayout = '[Layout] Delete Layout entity',
  DeleteLayoutSuccess = '[Layout] Delete Layout entity Success',
  DeleteLayoutFailure = '[Layout] Delete Layout entity Failure',

  UpdateLayoutNodesLocation = '[Layout] Update Layout nodes location',
  UpdateLayoutNodesLocationSuccess = '[Layout] Update Layout nodes location Success',
  UpdateLayoutNodesLocationFailure = '[Layout] Update Layout nodes location Failure',

  UpdateLayoutNodeLinksRoute = '[Layout] Update Layout node links route',
  UpdateLayoutNodeLinksRouteSuccess = '[Layout] Update Layout node links route Success',
  UpdateLayoutNodeLinksRouteFailure = '[Layout] Update Layout node links route Failure',
}

export class LoadLayouts implements Action {
  readonly type = LayoutActionTypes.LoadLayouts;
  constructor(public payload: LayoutEntitiesHttpParams) { }
}

export class LoadLayoutsSuccess implements Action {
  readonly type = LayoutActionTypes.LoadLayoutsSuccess;
  constructor(public payload: GetLayoutEntitiesApiResponse) { }
}

export class LoadLayoutsFailure implements Action {
  readonly type = LayoutActionTypes.LoadLayoutsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class LoadLayout implements Action {
  readonly type = LayoutActionTypes.LoadLayout;
  constructor(public payload: string) { }
}

export class LoadLayoutSuccess implements Action {
  readonly type = LayoutActionTypes.LoadLayoutSuccess;
  constructor(public payload: GetLayoutApiResponse) { }
}

export class LoadLayoutFailure implements Action {
  readonly type = LayoutActionTypes.LoadLayoutFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class AddLayout implements Action {
  readonly type = LayoutActionTypes.AddLayout;
  constructor(public payload: LayoutDetails) { }
}

export class AddLayoutSuccess implements Action {
  readonly type = LayoutActionTypes.AddLayoutSuccess;
  constructor(public payload: AddLayoutApiResponse) { }
}

export class AddLayoutFailure implements Action {
  readonly type = LayoutActionTypes.AddLayoutFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class UpdateLayout implements Action {
  readonly type = LayoutActionTypes.UpdateLayout;
  constructor(public payload: {id: string, data: LayoutDetails}) { }
}

export class UpdateLayoutSuccess implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutSuccess;
  constructor(public payload: UpdateLayoutApiResponse) { }
}

export class UpdateLayoutFailure implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class DeleteLayout implements Action {
  readonly type = LayoutActionTypes.DeleteLayout;
  constructor(public payload: string) {}
}

export class DeleteLayoutSuccess implements Action {
  readonly type = LayoutActionTypes.DeleteLayoutSuccess;
  constructor(public payload: any) {}
}

export class DeleteLayoutFailure implements Action {
  readonly type = LayoutActionTypes.DeleteLayoutFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class UpdateLayoutNodesLocation implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodesLocation;
  constructor(public payload: any) {}
}

export class UpdateLayoutNodesLocationSuccess implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodesLocationSuccess;
  constructor(public payload: any) {}
}

export class UpdateLayoutNodesLocationFailure implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodesLocationSuccess;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export class UpdateLayoutNodesLinksRoute implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodeLinksRoute;
  constructor(public payload: any) {}
}

export class UpdateLayoutNodesLinksRouteSuccess implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodeLinksRouteSuccess;
  constructor(public payload: any) {}
}

export class UpdateLayoutNodesLinksRouteFailure implements Action {
  readonly type = LayoutActionTypes.UpdateLayoutNodeLinksRouteFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type LayoutActionsUnion =
  | LoadLayouts
  | LoadLayoutsSuccess
  | LoadLayoutsFailure
  | LoadLayout
  | LoadLayoutSuccess
  | LoadLayoutFailure
  | AddLayout
  | AddLayoutSuccess
  | AddLayoutFailure
  | UpdateLayout
  | UpdateLayoutSuccess
  | UpdateLayoutFailure
  | DeleteLayout
  | DeleteLayoutSuccess
  | DeleteLayoutFailure
  | UpdateLayoutNodesLocation
  | UpdateLayoutNodesLocationSuccess
  | UpdateLayoutNodesLocationFailure
  | UpdateLayoutNodesLinksRoute
  | UpdateLayoutNodesLinksRouteSuccess
  | UpdateLayoutNodesLinksRouteFailure
  ;

