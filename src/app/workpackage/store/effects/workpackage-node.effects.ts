import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageNodesService } from '@app/workpackage/services/workpackage-nodes.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { AddWorkPackageNode, AddWorkPackageNodeFailure,
  AddWorkPackageNodeSuccess, WorkPackageNodeActionTypes } from '../actions/workpackage-node.actions';

@Injectable()
export class WorkPackageNodeEffects {
  constructor(
    private actions$: Actions,
    private workpackageNodeService: WorkPackageNodesService
  ) {}

  @Effect()
  addWorkpackageNode$ = this.actions$.pipe(
    ofType<AddWorkPackageNode>(WorkPackageNodeActionTypes.AddWorkPackageNode),
    map(action => action.payload),
    mergeMap((payload: {workpackageId: string, node: any}) => {
      return this.workpackageNodeService.addNode(payload.workpackageId, payload.node).pipe(
        switchMap((data: any) => [new AddWorkPackageNodeSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageNodeFailure(error)))
      );
    })
  );
}
