import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageService } from '@app/workpackage/services/workpackage.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  LoadWorkPackages,
  LoadWorkPackagesFailure,
  LoadWorkPackagesSuccess,
  WorkPackageActionTypes,
  AddWorkPackageEntity, UpdateWorkPackageEntity, AddWorkPackageEntitySuccess, AddWorkPackageEntityFailure,
  UpdateWorkPackageEntitySuccess, UpdateWorkPackageEntityFailure, DeleteWorkPackageEntity,
  DeleteWorkPackageEntitySuccess, DeleteWorkPackageEntityFailure, LoadWorkPackage, LoadWorkPackageSuccess } from '../actions/workpackage.actions';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse, WorkPackageDetailApiResponse } from '../models/workpackage.models';


@Injectable()
export class WorkPackageEffects {
  constructor(
    private actions$: Actions,
    private workpackageService: WorkPackageService
  ) {}

  @Effect()
  loadWorkPackageEntities$ = this.actions$.pipe(
    ofType<LoadWorkPackages>(WorkPackageActionTypes.LoadWorkPackages),
    map(action => action.payload),
    switchMap((payload: WorkPackageEntitiesHttpParams) => {
      return this.workpackageService.getWorkPackageEntities(payload).pipe(
        switchMap((data: WorkPackageEntitiesResponse) => [new LoadWorkPackagesSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadWorkPackagesFailure(error)))
      );
    })
  );

  @Effect()
  loadWorkPackage$ = this.actions$.pipe(
    ofType<LoadWorkPackage>(WorkPackageActionTypes.LoadWorkPackage),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.workpackageService.getWorkPackage(id).pipe(
        switchMap((workPackageDetail: WorkPackageDetailApiResponse) => [new LoadWorkPackageSuccess(workPackageDetail.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  addWorkPackageEntity$ = this.actions$.pipe(
    ofType<AddWorkPackageEntity>(WorkPackageActionTypes.AddWorkPackage),
    map(action => action.payload),
    switchMap((payload: any) => {
      return this.workpackageService.addWorkPackageEntity(payload).pipe(
        switchMap((data: any) => [new AddWorkPackageEntitySuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  updateWorkPackageEntity$ = this.actions$.pipe(
    ofType<UpdateWorkPackageEntity>(WorkPackageActionTypes.UpdateWorkPackage),
    map(action => action.payload),
    switchMap((payload: any) => {
      return this.workpackageService.updateWorkPackageEntity(payload.entityId, payload.entity).pipe(
        switchMap((data: any) => [new UpdateWorkPackageEntitySuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkPackageEntity$ = this.actions$.pipe(
    ofType<DeleteWorkPackageEntity>(WorkPackageActionTypes.DeleteWorkPackage),
    map(action => action.payload),
    switchMap((payload: any) => {
      return this.workpackageService.deleteWorkPackageEntity(payload).pipe(
        switchMap((data: any) => [new DeleteWorkPackageEntitySuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageEntityFailure(error)))
      );
    })
  );
}
