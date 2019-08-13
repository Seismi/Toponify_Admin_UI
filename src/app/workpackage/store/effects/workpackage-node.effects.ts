import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageNodesService } from '@app/workpackage/services/workpackage-nodes.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { AddWorkPackageNode, AddWorkPackageNodeFailure,
  AddWorkPackageNodeSuccess, WorkPackageNodeActionTypes, LoadWorkPackageNodeDescendants,
  LoadWorkPackageNodeDescendantsSuccess, LoadWorkPackageNodeDescendantsFailure, DeleteWorkpackageNode,
  DeleteWorkpackageNodeSuccess, DeleteWorkpackageNodeFailure } from '../actions/workpackage-node.actions';

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

  @Effect()
  loadWorkpackageNodeDescendants$ = this.actions$.pipe(
    ofType<LoadWorkPackageNodeDescendants>(WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendants),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, nodeId: string }) => {
      return this.workpackageNodeService.getNodeDescendants(payload.workpackageId, payload.nodeId).pipe(
        map(data => new LoadWorkPackageNodeDescendantsSuccess(data.data)),
        catchError(error => of(new LoadWorkPackageNodeDescendantsFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkpackageNode$ = this.actions$.pipe(
    ofType<DeleteWorkpackageNode>(WorkPackageNodeActionTypes.DeleteWorkpackageNode),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, nodeId: string }) => {
      return this.workpackageNodeService.deleteNode(payload.workpackageId, payload.nodeId).pipe(
        map(data => new DeleteWorkpackageNodeSuccess(data.data)),
        catchError(error => of(new DeleteWorkpackageNodeFailure(error)))
      );
    })
  );
}
