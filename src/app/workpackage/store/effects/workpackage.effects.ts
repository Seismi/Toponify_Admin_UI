import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageService } from '@app/workpackage/services/workpackage.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import {
  LoadWorkPackages,
  LoadWorkPackagesFailure,
  LoadWorkPackagesSuccess,
  WorkPackageActionTypes,
  AddWorkPackageEntity, UpdateWorkPackageEntity, AddWorkPackageEntitySuccess, AddWorkPackageEntityFailure,
  UpdateWorkPackageEntitySuccess, UpdateWorkPackageEntityFailure, DeleteWorkPackageEntity,
  DeleteWorkPackageEntitySuccess, DeleteWorkPackageEntityFailure,
  LoadWorkPackage, LoadWorkPackageSuccess, DeleteOwner, AddOwner, AddOwnerSuccess, AddOwnerFailure } from '../actions/workpackage.actions';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse,
  WorkPackageDetailApiResponse, WorkPackageApiRequest, WorkPackageApiResponse, OwnersEntityOrApproversEntity, WorkPackageEntity } from '../models/workpackage.models';

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
        switchMap((response: WorkPackageDetailApiResponse) => [new LoadWorkPackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  addWorkPackageEntity$ = this.actions$.pipe(
    ofType<AddWorkPackageEntity>(WorkPackageActionTypes.AddWorkPackage),
    map(action => action.payload),
    mergeMap((payload: WorkPackageApiRequest) => {
      return this.workpackageService.addWorkPackageEntity(payload).pipe(
        mergeMap((workpackage: WorkPackageApiResponse) => [new AddWorkPackageEntitySuccess(workpackage.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  updateWorkPackageEntity$ = this.actions$.pipe(
    ofType<UpdateWorkPackageEntity>(WorkPackageActionTypes.UpdateWorkPackage),
    map(action => action.payload),
    switchMap((payload: {workPackage: WorkPackageApiRequest, id: string}) => {
      return this.workpackageService.updateWorkPackageEntity(payload.workPackage, payload.id).pipe(
        switchMap((response: WorkPackageApiResponse) => [new UpdateWorkPackageEntitySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkPackageEntity$ = this.actions$.pipe(
    ofType<DeleteWorkPackageEntity>(WorkPackageActionTypes.DeleteWorkPackage),
    map(action => action.payload),
    switchMap((entityId: string) => {
      return this.workpackageService.deleteWorkPackageEntity(entityId).pipe(
        switchMap((_) => [new DeleteWorkPackageEntitySuccess(entityId)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  addOwner$ = this.actions$.pipe(
    ofType<AddOwner>(WorkPackageActionTypes.AddOwner),
    map(action => action.payload),
    mergeMap((payload: { owners: OwnersEntityOrApproversEntity, workPackageId: string, ownerId: string }) => {
      return this.workpackageService.addOwner(payload.owners, payload.workPackageId, payload.ownerId).pipe(
        mergeMap((response: WorkPackageApiResponse) => [new AddOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddOwnerFailure(error)))
      );
    })
  );

  @Effect()
  deleteOwner$ = this.actions$.pipe(
    ofType<DeleteOwner>(WorkPackageActionTypes.DeleteOwner),
    map(action => action.payload),
    switchMap((payload: {workPackageId: string, ownerId: string}) => {
      return this.workpackageService.deleteOwner(payload.workPackageId, payload.ownerId).pipe(
        switchMap((_) => [new DeleteWorkPackageEntitySuccess(payload.ownerId)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageEntityFailure(error)))
      );
    })
  );
}
