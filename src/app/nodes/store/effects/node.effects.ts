import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as NodeActions from '../actions/node.actions';
import { of } from 'rxjs';
import { NodeService } from '@app/nodes/services/node.service';
import { NodeActionTypes } from '../actions/node.actions';
import { NodesApiResponse, Error, NodeDetailApiResponse } from '../models/node.model';
import { NodeLinksApiResponse, NodeLinkDetailApiResponse } from '../models/node-link.model';


@Injectable()
export class NodeEffects {
  constructor(
    private actions$: Actions,
    private nodeService: NodeService
  ) {}

  @Effect()
  loadNodes$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodes>(NodeActionTypes.LoadNodes),
    switchMap(_ => {
      return this.nodeService.getNodes().pipe(
        switchMap((nodes: NodesApiResponse) => [new NodeActions.LoadNodesSuccess(nodes.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodesFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeLinks$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLinks>(NodeActionTypes.LoadNodeLinks),
    switchMap(_ => {
      return this.nodeService.getNodeLinks().pipe(
        switchMap((nodeLinks: NodeLinksApiResponse) => [new NodeActions.LoadNodeLinksSuccess(nodeLinks.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeLinksFailure(error)))
      );
    })
  );

  @Effect()
  loadNode$ = this.actions$.pipe(
    ofType<NodeActions.LoadNode>(NodeActionTypes.LoadNode),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.nodeService.getNode(id).pipe(
        switchMap((node: NodeDetailApiResponse) => [new NodeActions.LoadNodeSuccess(node.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeLink$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLink>(NodeActionTypes.LoadNodeLink),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.nodeService.getNodeLink(id).pipe(
        switchMap((nodeLink: NodeLinkDetailApiResponse) => [new NodeActions.LoadNodeLinkSuccess(nodeLink.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeLinkFailure(error)))
      );
    })
  );

  @Effect()
  loadMapView$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLink>(NodeActionTypes.LoadMapView),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.nodeService.getMapView(id).pipe(
        switchMap((data: any) => [new NodeActions.LoadMapViewSuccess(data.data)]),
        catchError((error: Error) => of(new NodeActions.LoadMapViewFailure(error)))
      );
    })
  );
}
