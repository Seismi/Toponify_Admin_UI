import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VersionSystemService } from '@app/version/services/version-system-service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as VersionSystemsActions from '../actions/version-system.actions';
import { VersionSystemActionTypes } from '../actions/version-system.actions';
import { SystemApiRequest, SystemApiResponse, SystemSingleApiResponse, VersionSystemApiResponse } from '../models/system.model';


@Injectable()
export class VersionSystemEffects {
  constructor(
    private actions$: Actions,
    private versionSystemService: VersionSystemService
  ) {}

  @Effect()
  loadSystems$ = this.actions$.pipe(
    ofType<VersionSystemsActions.LoadVersionSystems>(VersionSystemActionTypes.LoadVersionSystems),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.versionSystemService.getVersionSystems(versionId).pipe(
        switchMap((system: VersionSystemApiResponse) => [new VersionSystemsActions.LoadVersionSystemsSuccess(system.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionSystemsActions.LoadVersionSystemsFailure(error)))
      );
    })
  );

  @Effect()
  addSystem$ = this.actions$.pipe(
    ofType<VersionSystemsActions.AddVersionSystem>(VersionSystemActionTypes.AddVersionSystem),
    map(action => action.payload),
    mergeMap((payload: { system: SystemApiRequest, versionId: string}) => {
      return this.versionSystemService.addVersionSystem(payload.system, payload.versionId).pipe(
        mergeMap((system: SystemApiResponse) => [new VersionSystemsActions.AddVersionSystemSuccess(system.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionSystemsActions.AddVersionSystemFailure(error)))
      );
    })
  );

  @Effect()
  updateSystem$ = this.actions$.pipe(
    ofType<VersionSystemsActions.UpdateVersionSystem>(VersionSystemActionTypes.UpdateVersionSystem),
    map(action => action.payload),
    mergeMap((payload: { system: SystemApiRequest, versionId: string}) => {
      return this.versionSystemService.updateVersionSystem(payload.system, payload.versionId).pipe(
        mergeMap((version: SystemSingleApiResponse) => [new VersionSystemsActions.UpdateVersionSystemSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionSystemsActions.UpdateVersionSystemFailure(error)))
      );
    })
  );

  @Effect()
  deleteSystem$ = this.actions$.pipe(
    ofType<VersionSystemsActions.DeleteVersionSystem>(VersionSystemActionTypes.DeleteVersionSystem),
    map(action => action.payload),
    mergeMap((system: {versionId: string, systemId: string}) => {
      return this.versionSystemService.deleteVersionSystems(system.versionId, system.systemId).pipe(
        switchMap(_ => [new VersionSystemsActions.DeleteVersionSystemSuccess(system.systemId)]),
        catchError(error => of(new VersionSystemsActions.DeleteVersionSystemFailure(error)))
      );
    })
  );
}
