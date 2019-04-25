import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelService } from '@app/version/services/model.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as ModelActions from '../actions/model.actions';
import { ModelActionTypes } from '../actions/model.actions';
import { ModelApiRequest, ModelApiResponse, ModelSingleApiResponse } from '../models/model-version.model';


@Injectable()
export class ModelEffects {
  constructor(
    private actions$: Actions,
    private modelService: ModelService
  ) {}

  @Effect()
  loadModels$ = this.actions$.pipe(
    ofType<ModelActions.LoadModels>(ModelActionTypes.LoadModels),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.modelService.getModels(versionId).pipe(
        switchMap((model: ModelApiResponse) => [new ModelActions.LoadModelsSuccess(model.data)]),
        catchError((error: HttpErrorResponse) => of(new ModelActions.LoadModelsFailure(error)))
      );
    })
  );

  @Effect()
  addModel$ = this.actions$.pipe(
    ofType<ModelActions.AddModel>(ModelActionTypes.AddModel),
    map(action => action.payload),
    mergeMap((payload: {model: ModelApiRequest, versionId: string}) => {
      return this.modelService.addModel(payload.model, payload.versionId).pipe(
        mergeMap((model: ModelSingleApiResponse) => [new ModelActions.AddModelSuccess(model.data)]),
        catchError((error: HttpErrorResponse) => of(new ModelActions.AddModelFailure(error)))
      );
    })
  );

  @Effect()
  updateModel$ = this.actions$.pipe(
    ofType<ModelActions.UpdateModel>(ModelActionTypes.UpdateModel),
    map(action => action.payload),
    mergeMap((payload: {model: ModelApiRequest, versionId: string}) => {
      return this.modelService.updateModel(payload.model, payload.versionId).pipe(
        mergeMap((model: ModelSingleApiResponse) => [new ModelActions.UpdateModelSuccess(model.data)]),
        catchError((error: HttpErrorResponse) => of(new ModelActions.UpdateModelFailure(error)))
      );
    })
  );

  @Effect()
  deleteModel$ = this.actions$.pipe(
    ofType<ModelActions.DeleteModel>(ModelActionTypes.DeleteModel),
    map(action => action.payload),
    mergeMap((model: {versionId: string, modelId: string}) => {
      return this.modelService.deleteModel(model.versionId, model.modelId).pipe(
        switchMap(_ => [new ModelActions.DeleteModelSuccess(model.modelId)]),
        catchError(error => of(new ModelActions.DeleteModelFailure(error)))
      );
    })
  );
}

