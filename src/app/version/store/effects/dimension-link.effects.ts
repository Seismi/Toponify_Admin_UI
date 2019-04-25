import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, mergeMap } from 'rxjs/operators';
import * as DimensionLinkActions from '../actions/dimension-link.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of, forkJoin } from 'rxjs';
import { DimensionLinkService } from '@app/version/services/dimension-link.service';
import { DimensionLinkApiResponse, DimensionLinkApiRequest, DimensionLinkSingleApiResponse } from '../models/dimension-link.model';
import { DimensionLinkActionTypes } from '../actions/dimension-link.actions';
import {ModelLinkApiRequest} from '@app/version/store/models/model-links.model';


@Injectable()
export class DimensionLinkEffects {
  constructor(
    private actions$: Actions,
    private dimensionLinkService: DimensionLinkService
  ) {}

  @Effect()
  loadDimensionLinks$ = this.actions$.pipe(
    ofType<DimensionLinkActions.LoadDimensionLinks>(DimensionLinkActionTypes.LoadDimensionLinks),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.dimensionLinkService.getDimensionLinks(versionId).pipe(
        switchMap((dimensionLinks: DimensionLinkApiResponse) =>
            [new DimensionLinkActions.LoadDimensionLinksSuccess(dimensionLinks.data)]),
        catchError((error: HttpErrorResponse) => of(new DimensionLinkActions.LoadDimensionLinksFailure(error)))
      );
    })
  );

  @Effect()
  addDimensionLink$ = this.actions$.pipe(
    ofType<DimensionLinkActions.AddDimensionLink>(DimensionLinkActionTypes.AddDimensionLink),
    map(action => action.payload),
    mergeMap((payload: {dimensionLink: DimensionLinkApiRequest, versionId: string}) => {
      return this.dimensionLinkService.addDimensionLink(payload.dimensionLink, payload.versionId).pipe(
        switchMap((dimensionLink: DimensionLinkSingleApiResponse) =>
          [new DimensionLinkActions.AddDimensionLinkSuccess(dimensionLink.data)]),
        catchError((error: HttpErrorResponse) => of(new DimensionLinkActions.AddDimensionLinkFailure(error)))
      );
    })
  );

  @Effect()
  updateDimensionLink$ = this.actions$.pipe(
    ofType<DimensionLinkActions.UpdateDimensionLink>(DimensionLinkActionTypes.UpdateDimensionLink),
    map(action => action.payload),
    switchMap((payload: {dimensionLink: DimensionLinkApiRequest, versionId: string}[]) => {

      const observables = payload.map(item => {
        return this.dimensionLinkService.updateDimensionLink(item.dimensionLink, item.versionId);
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => mappedLinks[item.data.id] = item.data);
          return new DimensionLinkActions.UpdateDimensionLinkSuccess(mappedLinks);
        }),
        catchError(error => of(new DimensionLinkActions.UpdateDimensionLinkFailure(error)))
      );
    })
  );

  @Effect()
  deleteDimensionLink$ = this.actions$.pipe(
    ofType<DimensionLinkActions.DeleteDimensionLink>(DimensionLinkActionTypes.DeleteDimensionLink),
    map(action => action.payload),
    mergeMap((dimensionLink: {versionId: string, dimensionLinkId: string}) => {
      return this.dimensionLinkService.deleteDimensionLink(dimensionLink.versionId, dimensionLink.dimensionLinkId).pipe(
        map(_ => new DimensionLinkActions.DeleteDimensionLinkSuccess(dimensionLink.dimensionLinkId)),
        catchError(error => of(new DimensionLinkActions.DeleteDimensionLinkFailure(error)))
      );
    })
  );
}
