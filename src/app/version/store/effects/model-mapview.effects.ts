import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as MapViewActions from '../actions/mapview.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MapViewApiResponse } from '../models/mapview.model';
import { MapViewService } from '@app/version/services/map-view.service';


@Injectable()
export class MapViewEffects {
  constructor(
    private actions$: Actions,
    private mapViewervice: MapViewService
  ) {}

  @Effect()
  loadModel$ = this.actions$.pipe(
    ofType<MapViewActions.LoadMapView>(MapViewActions.MapViewActionTypes.LoadMapView),
    map(action => action.payload),
    switchMap((mapviewRequest: { versionId: string, linkId: string}) => {
      return this.mapViewervice.getMapView(mapviewRequest.versionId, mapviewRequest.linkId).pipe(
        switchMap((mapView: MapViewApiResponse) => [new MapViewActions.LoadMapViewSuccess(mapView.data)]),
        catchError((error: HttpErrorResponse) => of(new MapViewActions.LoadMapViewFailure(error)))
      );
    })
  );
}
