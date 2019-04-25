import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { MapView } from '../models/mapview.model';

export enum MapViewActionTypes {
  LoadMapView = '[MapView] Load  Map View ',
  SetMapView = '[MapView] Set  Map View ',
  LoadMapViewSuccess = '[MapView] Load  Map View Success',
  LoadMapViewFailure = '[MapView] Load  Map View Fail'
}

export class LoadMapView implements Action {
  readonly type = MapViewActionTypes.LoadMapView;
  constructor(public payload: { versionId: string, linkId: string}) {}
}

export class SetMapView implements Action {
  readonly type = MapViewActionTypes.SetMapView;
  constructor(public payload: string) {}
}

export class LoadMapViewSuccess implements Action {
  readonly type = MapViewActionTypes.LoadMapViewSuccess;
  constructor(public payload: MapView[]) {}
}

export class LoadMapViewFailure implements Action {
  readonly type = MapViewActionTypes.LoadMapViewFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}


export type MapViewActionsUnion =
  | LoadMapView
  | SetMapView
  | LoadMapViewSuccess
  | LoadMapViewFailure;

