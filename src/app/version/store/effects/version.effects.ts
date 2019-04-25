import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VersionService } from '@app/version/services/version.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap } from 'rxjs/operators';
import { LoadAttributes } from '../actions/attribute.actions';
import { LoadDimensionLinks } from '../actions/dimension-link.actions';
import { LoadDimensions } from '../actions/dimension.actions';
import { LoadElementLinks } from '../actions/element-link.actions';
import { LoadElements } from '../actions/element.actions';
import { LoadModelLinks } from '../actions/model-link.actions';
import { LoadModels } from '../actions/model.actions';
import { LoadSystemLinks } from '../actions/system-link.actions';
import { LoadVersionSystems } from '../actions/version-system.actions';
import * as VersionActions from '../actions/version.actions';
import { VersionActionTypes } from '../actions/version.actions';
import { AddVersionApiRequest, AddVersionApiResponse, CopyVersionApiRequest,
   CopyVersionApiResponse, UpdateVersionApiRequest, UpdateVersionApiResponse, VersionApiResponse } from '../models/version.model';


@Injectable()
export class VersionEffects {
  constructor(
    private actions$: Actions,
    private versionService: VersionService,
  ) { }

  @Effect()
  loadVersions$ = this.actions$.pipe(
    ofType<VersionActions.LoadVersions>(VersionActionTypes.LoadVersions),
    switchMap(_ => {
      return this.versionService.getVersions().pipe(
        switchMap((versions: VersionApiResponse) => [new VersionActions.LoadVersionsSuccess(versions.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.LoadVersionsFailure(error)))
      );
    })
  );

  @Effect()
  addVersion$ = this.actions$.pipe(
    ofType<VersionActions.AddVersion>(VersionActionTypes.AddVersion),
    map(action => action.payload),
    exhaustMap((payload: AddVersionApiRequest) => {
      return this.versionService.addVersion(payload).pipe(
        switchMap((version: AddVersionApiResponse) => [new VersionActions.AddVersionSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.AddVersionFailure(error)))
      );
    })
  );

  @Effect()
  updateVersion$ = this.actions$.pipe(
    ofType<VersionActions.UpdateVersion>(VersionActionTypes.UpdateVersion),
    map(action => action.payload),
    exhaustMap((payload: UpdateVersionApiRequest) => {
      return this.versionService.updateVersion(payload).pipe(
        switchMap((version: UpdateVersionApiResponse) => [new VersionActions.UpdateVersionSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.UpdateVersionFailure(error)))
      );
    })
  );

  @Effect()
  deleteVersion$ = this.actions$.pipe(
    ofType<VersionActions.DeleteVersion>(VersionActionTypes.DeleteVersion),
    map(action => action.payload),
    exhaustMap((id: string) => {
      return this.versionService.deleteVersion(id).pipe(
        switchMap((_) => [new VersionActions.DeleteVersionSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.DeleteVersionFailure(error)))
      );
    })
  );

  @Effect()
  copyVersion$ = this.actions$.pipe(
    ofType<VersionActions.CopyVersion>(VersionActionTypes.CopyVersion),
    map(action => action.payload),
    exhaustMap((payload: CopyVersionApiRequest) => {
      return this.versionService.addVersion(payload).pipe(
        switchMap((version: CopyVersionApiResponse) => [new VersionActions.CopyVersionSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.CopyVersionFailure(error)))
      );
    })
  );

  @Effect()
  unarchiveVersion$ = this.actions$.pipe(
    ofType<VersionActions.UnarchiveVersion>(VersionActionTypes.UnarchiveVersion),
    map(action => action.payload),
    exhaustMap((payload: UpdateVersionApiRequest) => {
      return this.versionService.updateVersion(payload).pipe(
        switchMap((version: UpdateVersionApiResponse) => [new VersionActions.UnarchiveVersionSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.UnarchiveVersionFailure(error)))
      );
    })
  );

  @Effect()
  archiveVersion$ = this.actions$.pipe(
    ofType<VersionActions.ArchiveVersion>(VersionActionTypes.ArchiveVersion),
    map(action => action.payload),
    exhaustMap((payload: UpdateVersionApiRequest) => {
      return this.versionService.updateVersion(payload).pipe(
        switchMap((version: UpdateVersionApiResponse) => [new VersionActions.ArchiveVersionSuccess(version.data)]),
        catchError((error: HttpErrorResponse) => of(new VersionActions.ArchiveVersionFailure(error)))
      );
    })
  );

  @Effect()
  refetchVersionData$ = this.actions$.pipe(
    ofType<VersionActions.RefetchVersionData>(VersionActionTypes.RefetchVersionData),
    map(action => action.payload),
    switchMap((payload: {versionId: string}) => [
      new LoadVersionSystems(payload.versionId),
      new LoadSystemLinks(payload.versionId),
      new LoadModels(payload.versionId),
      new LoadModelLinks(payload.versionId),
      new LoadDimensions(payload.versionId),
      new LoadDimensionLinks(payload.versionId),
      new LoadElements(payload.versionId),
      new LoadElementLinks(payload.versionId),
      new LoadAttributes(payload.versionId)
    ])
  );
}
