import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageLinksService } from '@app/workpackage/services/workpackage-links.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { NodeLink, NodeLinkDetailApiResponse } from '@app/architecture/store/models/node-link.model';
import {
  AddWorkPackageLink,
  AddWorkPackageLinkFailure,
  AddWorkPackageLinkSuccess,
  DeleteWorkpackageLink,
  DeleteWorkpackageLinkFailure,
  DeleteWorkpackageLinkSuccess,
  LoadWorkpackageLinkDescendants,
  LoadWorkpackageLinkDescendantsFailure,
  LoadWorkpackageLinkDescendantsSuccess,
  UpdateWorkPackageLink,
  UpdateWorkPackageLinkFailure,
  UpdateWorkPackageLinkSuccess,
  WorkPackageLinkActionTypes,
  AddWorkPackageLinkOwner,
  AddWorkPackageLinkOwnerSuccess,
  AddWorkPackageLinkOwnerFailure,
  DeleteWorkpackageLinkOwner,
  DeleteWorkpackageLinkOwnerSuccess,
  DeleteWorkpackageLinkOwnerFailure,
  AddWorkPackageLinkAttribute,
  AddWorkPackageLinkAttributeSuccess,
  AddWorkPackageLinkAttributeFailure
} from '../actions/workpackage-link.actions';

@Injectable()
export class WorkPackageLinkEffects {
  constructor(private actions$: Actions, private workpackageLinkService: WorkPackageLinksService) {}

  @Effect()
  addWorkpackageLink$ = this.actions$.pipe(
    ofType<AddWorkPackageLink>(WorkPackageLinkActionTypes.AddWorkPackageLink),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string; link: any }) => {
      return this.workpackageLinkService.addLink(payload.workpackageId, payload.link).pipe(
        switchMap((data: any) => [new AddWorkPackageLinkSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageLinkFailure(error)))
      );
    })
  );

  @Effect()
  updateWorkpackageLink$ = this.actions$.pipe(
    ofType<UpdateWorkPackageLink>(WorkPackageLinkActionTypes.UpdateWorkPackageLink),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string; linkId: string; link: any }) => {
      return this.workpackageLinkService.updateLink(payload.workpackageId, payload.linkId, payload.link).pipe(
        switchMap((data: any) => [new UpdateWorkPackageLinkSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateWorkPackageLinkFailure(error)))
      );
    })
  );

  @Effect()
  loadWorkpackageLinkDescendants$ = this.actions$.pipe(
    ofType<LoadWorkpackageLinkDescendants>(WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendants),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string; linkId: string }) => {
      return this.workpackageLinkService.getLinkDescendants(payload.workpackageId, payload.linkId).pipe(
        map(data => new LoadWorkpackageLinkDescendantsSuccess(data.data)),
        catchError(error => of(new LoadWorkpackageLinkDescendantsFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkpackageLink$ = this.actions$.pipe(
    ofType<DeleteWorkpackageLink>(WorkPackageLinkActionTypes.DeleteWorkpackageLink),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string; linkId: string }) => {
      return this.workpackageLinkService.deleteLink(payload.workpackageId, payload.linkId).pipe(
        map(data => new DeleteWorkpackageLinkSuccess(data.data)),
        catchError(error => of(new DeleteWorkpackageLinkFailure(error)))
      );
    })
  );

  @Effect()
  addWorkpackageLinkOwner$ = this.actions$.pipe(
    ofType<AddWorkPackageLinkOwner>(WorkPackageLinkActionTypes.AddWorkPackageLinkOwner),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; nodeLinkId: string; ownerId: string }) => {
      return this.workpackageLinkService.addLinkOwner(payload.workPackageId, payload.nodeLinkId, payload.ownerId).pipe(
        switchMap((response: NodeLink) => [
          new AddWorkPackageLinkOwnerSuccess(response),
          new UpdateWorkPackageLinkSuccess(response)
        ]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageLinkOwnerFailure(error)))
      );
    })
  );

  @Effect()
  deleteLinkOwner$ = this.actions$.pipe(
    ofType<DeleteWorkpackageLinkOwner>(WorkPackageLinkActionTypes.DeleteWorkpackageLinkOwner),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; nodeLinkId: string; ownerId: string }) => {
      return this.workpackageLinkService
        .deleteLinkOwner(payload.workPackageId, payload.nodeLinkId, payload.ownerId)
        .pipe(
          switchMap(data => [new DeleteWorkpackageLinkOwnerSuccess(data), new UpdateWorkPackageLinkSuccess(data)]),
          catchError(error => of(new DeleteWorkpackageLinkOwnerFailure(error)))
        );
    })
  );

  @Effect()
  addWorkpackageLinkAttribute$ = this.actions$.pipe(
    ofType<AddWorkPackageLinkAttribute>(WorkPackageLinkActionTypes.AddWorkPackageLinkAttribute),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string, nodeLinkId: string, attributeId: string }) => {
      return this.workpackageLinkService.addLinkAttribute(payload.workPackageId, payload.nodeLinkId, payload.attributeId).pipe(
        switchMap((response: NodeLinkDetailApiResponse) => [new AddWorkPackageLinkAttributeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageLinkAttributeFailure(error)))
      );
    })
  );
}
