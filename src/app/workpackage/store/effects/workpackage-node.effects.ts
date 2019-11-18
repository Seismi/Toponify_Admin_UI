import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageNodesService } from '@app/workpackage/services/workpackage-nodes.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import {
  AddWorkPackageNode,
  AddWorkPackageNodeFailure,
  AddWorkPackageNodeSuccess,
  WorkPackageNodeActionTypes,
  LoadWorkPackageNodeDescendants,
  LoadWorkPackageNodeDescendantsSuccess,
  LoadWorkPackageNodeDescendantsFailure,
  DeleteWorkpackageNode,
  DeleteWorkpackageNodeSuccess,
  DeleteWorkpackageNodeFailure,
  UpdateWorkPackageNode,
  UpdateWorkPackageNodeSuccess,
  UpdateWorkPackageNodeFailure,
  AddWorkpackageNodeOwner,
  AddWorkpackageNodeOwnerSuccess,
  AddWorkpackageNodeOwnerFailure,
  DeleteWorkpackageNodeOwner,
  DeleteWorkpackageNodeOwnerSuccess,
  DeleteWorkpackageNodeOwnerFailure,
  AddWorkPackageNodeDescendant,
  AddWorkPackageNodeDescendantSuccess,
  AddWorkPackageNodeDescendantFailure,
  DeleteWorkPackageNodeDescendant,
  DeleteWorkPackageNodeDescendantSuccess,
  DeleteWorkPackageNodeDescendantFailure,
  FindPotentialWorkpackageNodes,
  FindPotentialWorkpackageNodesSuccess,
  FindPotentialWorkpackageNodesFailure
} from '../actions/workpackage-node.actions';
import {UpdateNodeDescendants, UpdateNodeOwners} from '@app/architecture/store/actions/node.actions';
import { WorkPackageNodeFindPotential } from '../models/workpackage.models';
import { WorkPackageNodeDescendantsApiResponse, DescendantsEntity } from '@app/architecture/store/models/node.model';

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
    mergeMap((payload: {workpackageId: string, node: any, scope?: string}) => {
      return this.workpackageNodeService.addNode(payload.workpackageId, payload.node, payload.scope).pipe(
        switchMap((data: any) => [new AddWorkPackageNodeSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageNodeFailure(error)))
      );
    })
  );

  @Effect()
  addWorkpackageNodeDescendant$ = this.actions$.pipe(
    ofType<AddWorkPackageNodeDescendant>(WorkPackageNodeActionTypes.AddWorkPackageNodeDescendant),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string, nodeId: string, data: DescendantsEntity }) => {
      return this.workpackageNodeService.addNodeDescendant(payload.workPackageId, payload.nodeId, payload.data).pipe(
        switchMap((response: any) => [
          new AddWorkPackageNodeDescendantSuccess(response),
          new UpdateNodeDescendants({descendants: response.data, nodeId: payload.nodeId})
        ]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageNodeDescendantFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkpackageNodeDescendant$ = this.actions$.pipe(
    ofType<DeleteWorkPackageNodeDescendant>(WorkPackageNodeActionTypes.DeleteWorkPackageNodeDescendant),
    map(action => action.payload),
    mergeMap((payload: {workpackageId: string, nodeId: string, descendantId: string}) => {
      return this.workpackageNodeService.deleteNodeDescendant(payload.workpackageId, payload.nodeId, payload.descendantId).pipe(
        switchMap((data: any) => [
          new DeleteWorkPackageNodeDescendantSuccess(data),
          new UpdateNodeDescendants({descendants: data.data, nodeId: payload.nodeId})
        ]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageNodeDescendantFailure(error)))
      );
    })
  );

  @Effect()
  updateWorkpackageLink$ = this.actions$.pipe(
    ofType<UpdateWorkPackageNode>(WorkPackageNodeActionTypes.UpdateWorkPackageNode),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, nodeId: string, node: any }) => {
      return this.workpackageNodeService.updateNode(payload.workpackageId, payload.nodeId, payload.node).pipe(
        switchMap((data: any) => [new UpdateWorkPackageNodeSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateWorkPackageNodeFailure(error)))
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

  @Effect()
  addNodeOwner$ = this.actions$.pipe(
    ofType<AddWorkpackageNodeOwner>(WorkPackageNodeActionTypes.AddWorkpackageNodeOwner),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, nodeId: string, ownerId: string, data: any }) => {
      return this.workpackageNodeService.addNodeOwner(
        payload.workpackageId,
        payload.nodeId,
        payload.ownerId,
        payload.data
      ).pipe(
        mergeMap((response: any) => [
          new AddWorkpackageNodeOwnerSuccess(response.data),
          new UpdateNodeOwners({owners: response.data.owners, nodeId: payload.nodeId})
        ]),
        catchError((error: HttpErrorResponse) => of(new AddWorkpackageNodeOwnerFailure(error)))
      );
    })
  );

  @Effect()
  deleteNodeOwner$ = this.actions$.pipe(
    ofType<DeleteWorkpackageNodeOwner>(WorkPackageNodeActionTypes.DeleteWorkpackageNodeOwner),
    map(action => action.payload),
    mergeMap((payload: { workpackageId: string, nodeId: string, ownerId: string }) => {
      return this.workpackageNodeService.deleteNodeOwner(payload.workpackageId, payload.nodeId, payload.ownerId).pipe(
        switchMap(data => [
          new DeleteWorkpackageNodeOwnerSuccess(data),
          new UpdateNodeOwners({owners: data.data.owners, nodeId: payload.nodeId})
        ]),
        catchError(error => of(new DeleteWorkpackageNodeOwnerFailure(error)))
      );
    })
  );

  @Effect()
  findPotentialWorkPackageNodes$ = this.actions$.pipe(
    ofType<FindPotentialWorkpackageNodes>(WorkPackageNodeActionTypes.FindPotentialWorkpackageNodes),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string, nodeId: string, data: WorkPackageNodeFindPotential }) => {
      return this.workpackageNodeService.findPotentialWorkPackageNodes(payload.workPackageId, payload.nodeId, payload.data).pipe(
        switchMap((response: WorkPackageNodeDescendantsApiResponse) => [new FindPotentialWorkpackageNodesSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new FindPotentialWorkpackageNodesFailure(error)))
      );
    })
  );

}
