import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelLinkService } from '@app/version/services/model-link.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as ModelLinkActions from '../actions/model-link.actions';
import { ModelLinkActionTypes } from '../actions/model-link.actions';
import { ModelLinkApiRequest, ModelLinkApiResponse, ModelLinkSingleApiResponse } from '../models/model-links.model';


@Injectable()
export class ModelLinkEffects {
  constructor(
    private actions$: Actions,
    private modelLinkService: ModelLinkService
  ) {}

  @Effect()
  loadModelLinks$ = this.actions$.pipe(
    ofType<ModelLinkActions.LoadModelLinks>(ModelLinkActionTypes.LoadModelLinks),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.modelLinkService.getModelLinks(versionId).pipe(
        switchMap((modelLinks: ModelLinkApiResponse) => [new ModelLinkActions.LoadModelLinksSuccess(modelLinks.data)]),
        catchError((error: HttpErrorResponse) => of(new ModelLinkActions.LoadModelLinksFailure(error)))
      );
    })
  );

  @Effect()
  addModelLink$ = this.actions$.pipe(
    ofType<ModelLinkActions.AddModelLink>(ModelLinkActionTypes.AddModelLink),
    map(action => action.payload),
    mergeMap((payload: {modelLink: ModelLinkApiRequest, versionId: string}) => {
      return this.modelLinkService.addModelLink(payload.modelLink, payload.versionId).pipe(
        mergeMap((modelLink: ModelLinkSingleApiResponse) => [new ModelLinkActions.AddModelLinkSuccess(modelLink.data)]),
        catchError((error: HttpErrorResponse) => of(new ModelLinkActions.AddModelLinkFailure(error)))
      );
    })
  );

  @Effect()
  updateModelLink$ = this.actions$.pipe(
    ofType<ModelLinkActions.UpdateModelLink>(ModelLinkActionTypes.UpdateModelLink),
    map(action => action.payload),
    switchMap((payload: {modelLink: ModelLinkApiRequest, versionId: string}[]) => {

      const observables = payload.map(item => {
        return this.modelLinkService.updateModelLink(item.modelLink, item.versionId);
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => mappedLinks[item.data.id] = item.data);
          return new ModelLinkActions.UpdateModelLinkSuccess(mappedLinks);
        }),
        catchError(error => of(new ModelLinkActions.UpdateModeLinkFailure(error)))
      );
    })
  );

  @Effect()
  deleteModel$ = this.actions$.pipe(
    ofType<ModelLinkActions.DeleteModelLink>(ModelLinkActionTypes.DeleteModelLink),
    map(action => action.payload),
    mergeMap((modelLink: {versionId: string, modelLinkId: string}) => {
      return this.modelLinkService.deleteModelLink(modelLink.versionId, modelLink.modelLinkId).pipe(
        map(_ => new ModelLinkActions.DeleteModelLinkSuccess(modelLink.modelLinkId)),
        catchError(error => of(new ModelLinkActions.DeleteModeLinkFailure(error)))
      );
    })
  );
}
