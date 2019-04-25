import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemLinkService } from '@app/version/services/system-links.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as SystemLinkActions from '../actions/system-link.actions';
import { SystemLinkActionTypes } from '../actions/system-link.actions';
import { AddSystemLinkApiResponse, SystemLinkApiRequest, SystemLinkApiResponse } from '../models/system-links.model';


@Injectable()
export class SystemLinkEffects {
  constructor(
    private actions$: Actions,
    private systemLinkService: SystemLinkService
  ) {}

  @Effect()
  loadSystemLinks$ = this.actions$.pipe(
    ofType<SystemLinkActions.LoadSystemLinks>(SystemLinkActionTypes.LoadSystemLinks),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.systemLinkService.getSystemLinks(versionId).pipe(
        switchMap((systemLink: SystemLinkApiResponse) => [new SystemLinkActions.LoadSystemLinksSuccess(systemLink.data)]),
        catchError((error: HttpErrorResponse) => of(new SystemLinkActions.LoadSystemLinksFailure(error)))
      );
    })
  );

  @Effect()
  addSystemLink$ = this.actions$.pipe(
    ofType<SystemLinkActions.AddSystemLinks>(SystemLinkActionTypes.AddSystemLinks),
    map(action => action.payload),
    mergeMap((payload: { systemLink: SystemLinkApiRequest, versionId: string}) => {
      return this.systemLinkService.addSystemLink(payload.systemLink, payload.versionId).pipe(
        mergeMap((systemLink: AddSystemLinkApiResponse) => [new SystemLinkActions.AddSystemLinksSuccess(systemLink.data)]),
        catchError((error: HttpErrorResponse) => of(new SystemLinkActions.AddSystemLinksFailure(error)))
      );
    })
  );

  @Effect()
  updateSystemLink$ = this.actions$.pipe(
    ofType<SystemLinkActions.UpdateSystemLinks>(SystemLinkActionTypes.UpdateSystemLinks),
    map(action => action.payload),
    switchMap((payload: {versionId: string, systemLink: SystemLinkApiRequest}[]) => {

      const observables = payload.map(item => {
        return this.systemLinkService.updateSystemLink(item.systemLink, item.versionId);
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => mappedLinks[item.data.id] = item.data);
          return new SystemLinkActions.UpdateSystemLinksSuccess(mappedLinks);
        }),
        catchError(error => of(new SystemLinkActions.UpdateSystemLinksFailure(error)))
      );
    })
  );

  @Effect()
  deleteSystemLink$ = this.actions$.pipe(
    ofType<SystemLinkActions.DeleteSystemLink>(SystemLinkActionTypes.DeleteSystemLink),
    map(action => action.payload),
    mergeMap((systemLink: {versionId: string, systemLinkId: string}) => {
      return this.systemLinkService.deleteSystemLink(systemLink.versionId, systemLink.systemLinkId).pipe(
        map(_ => new SystemLinkActions.DeleteSystemLinkSuccess(systemLink.systemLinkId)),
        catchError(error => of(new SystemLinkActions.DeleteSystemLinkFailure(error)))
      );
    })
  );
}
