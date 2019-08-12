import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageLinksService } from '@app/workpackage/services/workpackage-links.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AddWorkPackageLink, WorkPackageLinkActionTypes,
  AddWorkPackageLinkSuccess, AddWorkPackageLinkFailure, UpdateWorkPackageLink,
  UpdateWorkPackageLinkSuccess, UpdateWorkPackageLinkFailure } from '../actions/workpackage-link.actions';

@Injectable()
export class WorkPackageLinkEffects {
  constructor(
    private actions$: Actions,
    private workpackageLinkService: WorkPackageLinksService
  ) {}

  @Effect()
  addWorkpackageLink$ = this.actions$.pipe(
    ofType<AddWorkPackageLink>(WorkPackageLinkActionTypes.AddWorkPackageLink),
    map(action => action.payload),
    mergeMap((payload: {workpackageId: string, link: any}) => {
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
    mergeMap((payload: { workpackageId: string, linkId: string, link: any }) => {
      return this.workpackageLinkService.updateLink(payload.workpackageId, payload.linkId, payload.link).pipe(
        switchMap((data: any) => [new UpdateWorkPackageLinkSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateWorkPackageLinkFailure(error)))
      );
    })
  );
}
