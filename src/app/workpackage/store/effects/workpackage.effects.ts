import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageService } from '@app/workpackage/services/workpackage.service';
import { WorkPackageNodesService } from '@app/workpackage/services/workpackage-nodes.service';
import {WorkPackageLinksService} from '@app/workpackage/services/workpackage-links.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  AddObjective,
  AddObjectiveFailure,
  AddObjectiveSuccess,
  AddOwner,
  AddOwnerFailure,
  AddOwnerSuccess,
  AddRadio,
  AddRadioFailure,
  AddRadioSuccess,
  AddWorkPackageEntity,
  AddWorkPackageEntityFailure,
  AddWorkPackageEntitySuccess,
  ApproveWorkpackage,
  ApproveWorkpackageFailure,
  ApproveWorkpackageSuccess,
  DeleteObjective,
  DeleteObjectiveFailure,
  DeleteObjectiveSuccess,
  DeleteOwner,
  DeleteOwnerFailure,
  DeleteOwnerSuccess,
  DeleteRadio,
  DeleteRadioFailure,
  DeleteRadioSuccess,
  DeleteWorkPackageEntity,
  DeleteWorkPackageEntityFailure,
  DeleteWorkPackageEntitySuccess,
  GetWorkpackageAvailability,
  GetWorkpackageAvailabilityFailure,
  GetWorkpackageAvailabilitySuccess,
  LoadWorkPackage,
  LoadWorkPackages,
  LoadWorkPackagesFailure,
  LoadWorkPackagesSuccess,
  LoadWorkPackageSuccess,
  MergeWorkpackage,
  MergeWorkpackageFailure,
  MergeWorkpackageSuccess,
  RejectWorkpackage,
  RejectWorkpackageFailure,
  RejectWorkpackageSuccess,
  ResetWorkpackage,
  ResetWorkpackageFailure,
  ResetWorkpackageSuccess,
  SubmitWorkpackage,
  SubmitWorkpackageFailure,
  SubmitWorkpackageSuccess,
  SupersedeWorkpackage,
  SupersedeWorkpackageFailure,
  SupersedeWorkpackageSuccess,
  UpdateWorkPackageEntity,
  UpdateWorkPackageEntityFailure,
  UpdateWorkPackageEntitySuccess,
  WorkPackageActionTypes,
  UpdateCustomProperty,
  UpdateCustomPropertySuccess,
  UpdateCustomPropertyFailure,
  DeleteCustomProperty,
  DeleteCustomPropertySuccess,
  DeleteCustomPropertyFailure,
  CreateObjective,
  CreateObjectiveSuccess,
  CreateObjectiveFailure,
  LoadWorkPackageBaselineAvailability,
  LoadWorkPackageBaselineAvailabilitySuccess,
  LoadWorkPackageBaselineAvailabilityFailure,
  AddWorkPackageBaseline,
  AddWorkPackageBaselineSuccess,
  AddWorkPackageBaselineFailure,
  DeleteWorkPackageBaseline,
  DeleteWorkPackageBaselineSuccess,
  DeleteWorkPackageBaselineFailure,
  AddWorkPackageMapViewTransformation,
  AddWorkPackageMapViewTransformationFailure,
  AddWorkPackageMapViewTransformationSuccess,
  SetWorkpackageEditMode
} from '../actions/workpackage.actions';
import {LoadMapView} from '@app/architecture/store/actions/node.actions';
import {
  OwnersEntityOrApproversEntity,
  WorkPackageApiRequest,
  WorkPackageApiResponse,
  WorkPackageDetailApiResponse,
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse,
  Baseline
} from '../models/workpackage.models';
import { State as WorkpackageState } from '../reducers/workpackage.reducer';
import { Store } from '@ngrx/store';
import { CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';

@Injectable()
export class WorkPackageEffects {
  constructor(
    private store$: Store<WorkpackageState>,
    private actions$: Actions,
    private workpackageService: WorkPackageService,
    private workpackageNodeService: WorkPackageNodesService,
    private workpackageLinkService: WorkPackageLinksService
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
    switchMap((payload: { workPackage: WorkPackageApiRequest; entityId: string }) => {
      return this.workpackageService.updateWorkPackageEntity(payload.entityId, payload.workPackage).pipe(
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
        switchMap(_ => [new DeleteWorkPackageEntitySuccess(entityId)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageEntityFailure(error)))
      );
    })
  );

  @Effect()
  addOwner$ = this.actions$.pipe(
    ofType<AddOwner>(WorkPackageActionTypes.AddOwner),
    map(action => action.payload),
    mergeMap((payload: { owners: OwnersEntityOrApproversEntity; workPackageId: string; ownerId: string }) => {
      return this.workpackageService.addOwner(payload.owners, payload.workPackageId, payload.ownerId).pipe(
        mergeMap((response: any) => [new AddOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddOwnerFailure(error)))
      );
    })
  );

  @Effect()
  deleteOwner$ = this.actions$.pipe(
    ofType<DeleteOwner>(WorkPackageActionTypes.DeleteOwner),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; ownerId: string }) => {
      return this.workpackageService.deleteOwner(payload.workPackageId, payload.ownerId).pipe(
        switchMap((response: any) => [new DeleteOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteOwnerFailure(error)))
      );
    })
  );

  @Effect()
  addObjective$ = this.actions$.pipe(
    ofType<AddObjective>(WorkPackageActionTypes.AddObjective),
    map(action => action.payload),
    mergeMap((payload: { data: any; workPackageId: string; objectiveId: string }) => {
      return this.workpackageService.addObjective(payload.data, payload.workPackageId, payload.objectiveId).pipe(
        mergeMap((response: any) => [new AddObjectiveSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddObjectiveFailure(error)))
      );
    })
  );

  @Effect()
  createObjective$ = this.actions$.pipe(
    ofType<CreateObjective>(WorkPackageActionTypes.CreateObjective),
    map(action => action.payload),
    mergeMap((payload: { data: { title: string; description: string }; workPackageId: string }) => {
      return this.workpackageService.createObjective(payload.data).pipe(
        mergeMap((response: any) => [
          new CreateObjectiveSuccess(response.data),
          new AddObjective({ data: response.data, workPackageId: payload.workPackageId, objectiveId: response.data.id })
        ]),
        catchError((error: HttpErrorResponse) => of(new CreateObjectiveFailure(error)))
      );
    })
  );

  @Effect()
  deleteObjective$ = this.actions$.pipe(
    ofType<DeleteObjective>(WorkPackageActionTypes.DeleteObjective),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; objectiveId: string }) => {
      return this.workpackageService.deleteObjective(payload.workPackageId, payload.objectiveId).pipe(
        switchMap((response: any) => [new DeleteObjectiveSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteObjectiveFailure(error)))
      );
    })
  );

  @Effect()
  getWorkpackageAvailability$ = this.actions$.pipe(
    ofType<GetWorkpackageAvailability>(WorkPackageActionTypes.GetWorkpackageAvailability),
    map(action => action.payload),
    switchMap((params: any) => {
      return this.workpackageService.getWorkPackageAvailability(params).pipe(
        switchMap((response: any) => {
          return [new GetWorkpackageAvailabilitySuccess(response.data)];
        }),
        catchError((error: HttpErrorResponse) => of(new GetWorkpackageAvailabilityFailure(error)))
      );
    })
  );

  @Effect()
  addRadio$ = this.actions$.pipe(
    ofType<AddRadio>(WorkPackageActionTypes.AddRadio),
    map(action => action.payload),
    mergeMap((payload: { data: any; workPackageId: string; radioId: string }) => {
      return this.workpackageService.addRadio(payload.data, payload.workPackageId, payload.radioId).pipe(
        mergeMap((response: any) => [new AddRadioSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioFailure(error)))
      );
    })
  );

  @Effect()
  deleteRadio$ = this.actions$.pipe(
    ofType<DeleteRadio>(WorkPackageActionTypes.DeleteRadio),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; radioId: string }) => {
      return this.workpackageService.deleteRadio(payload.workPackageId, payload.radioId).pipe(
        switchMap((response: any) => [new DeleteRadioSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioFailure(error)))
      );
    })
  );

  @Effect()
  updateCustomProperty$ = this.actions$.pipe(
    ofType<UpdateCustomProperty>(WorkPackageActionTypes.UpdateCustomProperty),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; customPropertyId: string; data: string }) => {
      return this.workpackageService.updateProperty(payload.workPackageId, payload.customPropertyId, payload.data).pipe(
        switchMap((response: WorkPackageDetailApiResponse) => [new UpdateCustomPropertySuccess(response.data)]),
        catchError((error: Error) => of(new UpdateCustomPropertyFailure(error)))
      );
    })
  );

  @Effect()
  deleteCustomProperty$ = this.actions$.pipe(
    ofType<DeleteCustomProperty>(WorkPackageActionTypes.DeleteCustomProperty),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; customPropertyId: string }) => {
      return this.workpackageService.deleteProperty(payload.workPackageId, payload.customPropertyId).pipe(
        map(response => new DeleteCustomPropertySuccess(response.data)),
        catchError((error: Error) => of(new DeleteCustomPropertyFailure(error)))
      );
    })
  );

  @Effect()
  submitWorkpackage$ = this.actions$.pipe(
    ofType<SubmitWorkpackage>(WorkPackageActionTypes.SubmitWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.submitWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new SubmitWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new SubmitWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  approveWorkpackage$ = this.actions$.pipe(
    ofType<ApproveWorkpackage>(WorkPackageActionTypes.ApproveWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.approveWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new ApproveWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ApproveWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  rejectWorkpackage$ = this.actions$.pipe(
    ofType<RejectWorkpackage>(WorkPackageActionTypes.RejectWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.rejectWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new RejectWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new RejectWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  mergeWorkpackage$ = this.actions$.pipe(
    ofType<MergeWorkpackage>(WorkPackageActionTypes.MergeWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.mergeWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new MergeWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new MergeWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  resetWorkpackage$ = this.actions$.pipe(
    ofType<ResetWorkpackage>(WorkPackageActionTypes.ResetWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.resetWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new ResetWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ResetWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  supersedeWorkpackage$ = this.actions$.pipe(
    ofType<SupersedeWorkpackage>(WorkPackageActionTypes.SupersedeWorkpackage),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.workpackageService.supersedeWorkpackage(payload).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new SupersedeWorkpackageSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new SupersedeWorkpackageFailure(error)))
      );
    })
  );

  @Effect()
  loadWorkPackageBaselineAvailability$ = this.actions$.pipe(
    ofType<LoadWorkPackageBaselineAvailability>(WorkPackageActionTypes.LoadWorkPackageBaselineAvailability),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string }) => {
      return this.workpackageService.getWorkPackageBaselineAvailability(payload.workPackageId).pipe(
        switchMap((response: { data: Baseline[] }) => [new LoadWorkPackageBaselineAvailabilitySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadWorkPackageBaselineAvailabilityFailure(error)))
      );
    })
  );

  @Effect()
  addWorkPackageBaseline$ = this.actions$.pipe(
    ofType<AddWorkPackageBaseline>(WorkPackageActionTypes.AddWorkPackageBaseline),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; baselineId: string }) => {
      return this.workpackageService.addWorkPackageBaseline(payload.workPackageId, payload.baselineId).pipe(
        mergeMap((response: WorkPackageDetailApiResponse) => [new AddWorkPackageBaselineSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageBaselineFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkPackageBaseline$ = this.actions$.pipe(
    ofType<DeleteWorkPackageBaseline>(WorkPackageActionTypes.DeleteWorkPackageBaseline),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; baselineId: string }) => {
      return this.workpackageService.deleteWorkPackageBaseline(payload.workPackageId, payload.baselineId).pipe(
        switchMap((response: WorkPackageDetailApiResponse) => [new DeleteWorkPackageBaselineSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageBaselineFailure(error)))
      );
    })
  );

  @Effect()
  addWorkPackageMapViewTransformation$ = this.actions$.pipe(
    ofType<AddWorkPackageMapViewTransformation>(WorkPackageActionTypes.AddWorkPackageMapViewTransformation),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, scope: string, nodeData: any, linkData: any[], mapViewParams: any }) => {
      return this.workpackageNodeService.addNode(payload.workpackageId, payload.nodeData, payload.scope).pipe(
        mergeMap(response => {
          const newLinkObservables = payload.linkData.map(function(data) {
            return this.workpackageLinkService.addLink(payload.workpackageId, data);
          }.bind(this));

          return forkJoin(newLinkObservables).pipe(
            mergeMap((data: any) => [
              new AddWorkPackageMapViewTransformationSuccess(data.concat(response)),
              new LoadMapView(payload.mapViewParams)
            ]),
            catchError((error: HttpErrorResponse) => of(new AddWorkPackageMapViewTransformationFailure(error)))
          );
        })
      );
    })
  );
}
