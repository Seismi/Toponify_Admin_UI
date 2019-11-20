import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageNodesService, GetWorkPackageNodeScopesQueryParams } from '@app/workpackage/services/workpackage-nodes.service';
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
  LoadWorkPackageNodeScopes, 
  LoadWorkPackageNodeScopesSuccess, 
  LoadWorkPackageNodeScopesFailure, 
  LoadWorkPackageNodeScopesAvailability, 
  LoadWorkPackageNodeScopesAvailabilitySuccess, 
  LoadWorkPackageNodeScopesAvailabilityFailure, 
  AddWorkPackageNodeScope, 
  AddWorkPackageNodeScopeSuccess, 
  AddWorkPackageNodeScopeFailure, 
  DeleteWorkPackageNodeScope, 
  DeleteWorkPackageNodeScopeSuccess, 
  DeleteWorkPackageNodeScopeFailure,
  FindPotentialWorkpackageNodes,
  FindPotentialWorkpackageNodesSuccess,
  FindPotentialWorkpackageNodesFailure
} from '../actions/workpackage-node.actions';
import { UpdateNodeDescendants } from '@app/architecture/store/actions/node.actions';
import { WorkPackageNodeScopesApiResponse, WorkPackageNodeScopeApiResponse, WorkPackageNodeFindPotential } from '../models/workpackage.models';
import { DescendantsEntity, WorkPackageNodeDescendantsApiResponse } from '@app/architecture/store/models/node.model';


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
  addWorkpackageNodeDescenadant$ = this.actions$.pipe(
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
  deleteWorkpackageNodeDescenadant$ = this.actions$.pipe(
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
        mergeMap((response: any) => [new AddWorkpackageNodeOwnerSuccess(response.data)]),
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
        map(data => new DeleteWorkpackageNodeOwnerSuccess(data.data)),
        catchError(error => of(new DeleteWorkpackageNodeOwnerFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeScopes$ = this.actions$.pipe(
    ofType<LoadWorkPackageNodeScopes>(WorkPackageNodeActionTypes.LoadWorkPackageNodeScopes),
    map(action => action.payload),
    switchMap((payload: { nodeId: string, queryParams: GetWorkPackageNodeScopesQueryParams }) => {
      return this.workpackageNodeService.getWorkPackageNodeScopes(payload.nodeId, payload.queryParams).pipe(
        switchMap((response: WorkPackageNodeScopesApiResponse) => [new LoadWorkPackageNodeScopesSuccess(response.data)]),
        catchError((error: Error) => of(new LoadWorkPackageNodeScopesFailure(error)))
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

  @Effect()
  loadNodeScopesAvailability$ = this.actions$.pipe(
    ofType<LoadWorkPackageNodeScopesAvailability>(WorkPackageNodeActionTypes.LoadWorkPackageNodeScopesAvailability),
    map(action => action.payload),
    switchMap((payload: { nodeId: string, queryParams: GetWorkPackageNodeScopesQueryParams }) => {
      return this.workpackageNodeService.getWorkPackageNodeScopes(payload.nodeId, payload.queryParams).pipe(
        switchMap((response: WorkPackageNodeScopesApiResponse) => [new LoadWorkPackageNodeScopesAvailabilitySuccess(response.data)]),
        catchError((error: Error) => of(new LoadWorkPackageNodeScopesAvailabilityFailure(error)))
      );
    })
  );

  @Effect()
  addWorkPackageNodeScope$ = this.actions$.pipe(
    ofType<AddWorkPackageNodeScope>(WorkPackageNodeActionTypes.AddWorkPackageNodeScope),
    map(action => action.payload),
    switchMap((payload: { scopeId: string, data: string[] }) => {
      return this.workpackageNodeService.addWorkPackageNodeScope(payload.scopeId, payload.data).pipe(
        switchMap((response: WorkPackageNodeScopeApiResponse) => [new AddWorkPackageNodeScopeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new AddWorkPackageNodeScopeFailure(error)))
      );
    })
  );

  @Effect()
  deleteWorkPackageNodeScope$ = this.actions$.pipe(
    ofType<DeleteWorkPackageNodeScope>(WorkPackageNodeActionTypes.DeleteWorkPackageNodeScope),
    map(action => action.payload),
    switchMap((payload: { scopeId: string, nodeId: string }) => {
      return this.workpackageNodeService.deleteWorkPackageNodeScope(payload.scopeId, payload.nodeId).pipe(
        switchMap((response) => [new DeleteWorkPackageNodeScopeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteWorkPackageNodeScopeFailure(error)))
      );
    })
  );
}