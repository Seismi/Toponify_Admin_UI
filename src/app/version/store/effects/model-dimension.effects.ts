import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import * as DimensionActions from '../actions/dimension.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { DimensionService } from '@app/version/services/dimension.service';
import { DimensionActionTypes } from '../actions/dimension.actions';
import { DimensionApiResponse, DimensionApiRequest, DimensionSingleApiResponse } from '../models/dimension.model';
import {ModelApiRequest} from '@app/version/store/models/model-version.model';


@Injectable()
export class Dimensioneffects {
  constructor(
    private actions$: Actions,
    private dimensionService: DimensionService
  ) {}

  @Effect()
  loadDimensions$ = this.actions$.pipe(
    ofType<DimensionActions.LoadDimensions>(DimensionActionTypes.LoadDimensions),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.dimensionService.getModelDimensions(versionId).pipe(
        switchMap((Dimensions: DimensionApiResponse) =>
            [new DimensionActions.LoadDimensionsSuccess(Dimensions.data)]),
        catchError((error: HttpErrorResponse) => of(new DimensionActions.LoadDimensionsFailure(error)))
      );
    })
  );

  @Effect()
  addDimension$ = this.actions$.pipe(
    ofType<DimensionActions.AddDimension>(DimensionActionTypes.AddDimension),
    map(action => action.payload),
    mergeMap((payload: {dimension: DimensionApiRequest, versionId: string}) => {
      return this.dimensionService.addDimension(payload.dimension, payload.versionId).pipe(
        switchMap((dimension: DimensionSingleApiResponse) => [new DimensionActions.AddDimensionSuccess(dimension.data)]),
        catchError((error: HttpErrorResponse) => of(new DimensionActions.AddDimensionFailure(error)))
      );
    })
  );

  @Effect()
  updateDimension$ = this.actions$.pipe(
    ofType<DimensionActions.UpdateDimension>(DimensionActionTypes.UpdateDimension),
    map(action => action.payload),
    mergeMap((payload: { dimension: DimensionApiRequest, versionId: string}) => {
      return this.dimensionService.updateDimension(payload.dimension, payload.versionId).pipe(
        mergeMap((dimension: DimensionSingleApiResponse) => [new DimensionActions.UpdateDimensionSuccess(dimension.data)]),
        catchError((error: HttpErrorResponse) => of(new DimensionActions.UpdateDimensionFailure(error)))
      );
    })
  );

  @Effect()
  deleteDimension$ = this.actions$.pipe(
    ofType<DimensionActions.DeleteDimension>(DimensionActionTypes.DeleteDimension),
    map(action => action.payload),
    mergeMap((dimension: {versionId: string, dimensionId: string}) => {
      return this.dimensionService.deleteDimension(dimension.versionId, dimension.dimensionId).pipe(
        map(_ => new DimensionActions.DeleteDimensionSuccess(dimension.dimensionId)),
        catchError(error => of(new DimensionActions.DeleteDimensionFailure(error)))
      );
    })
  );
}
