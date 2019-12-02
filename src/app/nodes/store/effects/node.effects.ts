import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as NodeActions from '../actions/node.actions';
import { of, forkJoin } from 'rxjs';
import { NodeService } from '@app/nodes/services/node.service';
import { NodeActionTypes } from '../actions/node.actions';
import { NodesApiResponse, Error, NodeDetailApiResponse, NodeUpdatePayload } from '../models/node.model';
import { NodeLinksApiResponse, NodeLinkDetailApiResponse, LinkUpdatePayload } from '../models/node-link.model';


@Injectable()
export class NodeEffects {
  constructor(
    private actions$: Actions,
    private nodeService: NodeService
  ) {}
  //
  // @Effect()
  // loadNodes$ = this.actions$.pipe(
  //   ofType<NodeActions.LoadNodes>(NodeActionTypes.LoadNodes),
  //   switchMap(_ => {
  //     return this.nodeService.getNodes().pipe(
  //       switchMap((nodes: NodesApiResponse) => [new NodeActions.LoadNodesSuccess(nodes.data)]),
  //       catchError((error: Error) => of(new NodeActions.LoadNodesFailure(error)))
  //     );
  //   })
  // );

  // @Effect()
  // loadNodeLinks$ = this.actions$.pipe(
  //   ofType<NodeActions.LoadNodeLinks>(NodeActionTypes.LoadNodeLinks),
  //   switchMap(_ => {
  //     return this.nodeService.getNodeLinks().pipe(
  //       switchMap((nodeLinks: NodeLinksApiResponse) => [new NodeActions.LoadNodeLinksSuccess(nodeLinks.data)]),
  //       catchError((error: Error) => of(new NodeActions.LoadNodeLinksFailure(error)))
  //     );
  //   })
  // );

  @Effect()
  loadNodeUsageView$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeUsageView>(NodeActionTypes.LoadNodeUsageView),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.nodeService.getNodeUsageView(payload).pipe(
        switchMap((data: any) => [new NodeActions.LoadNodeUsageViewSuccess(data.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeUsageViewFailure(error)))
      );
    })
  );

  @Effect()
  updateLinks$ = this.actions$.pipe(
    ofType<NodeActions.UpdateLinks>(NodeActionTypes.UpdateLinks),
    map(action => action.payload),
    switchMap((payload: LinkUpdatePayload) => {

      const observables = payload.links.map((item: any) => {
        return this.nodeService.updateLayoutNodeLinksRoute(payload.layoutId, item);
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => mappedLinks[item.data.id] = item.data);
          return new NodeActions.UpdateLinksSuccess(mappedLinks);
        }),
        catchError(error => of(new NodeActions.UpdateLinksFailure(error)))
      );
    })
  );

  @Effect()
  updateNodes$ = this.actions$.pipe(
    ofType<NodeActions.UpdateNodes>(NodeActionTypes.UpdateNodes),
    map(action => action.payload),
    switchMap((payload: NodeUpdatePayload) => {
      const observables = payload.nodes.map((item: any) => {
        return this.nodeService
          .updateLayoutNodesLocation(
            payload.layoutId,
            item
          );
      });

      return forkJoin(observables).pipe(
        map((data: any) => {
          const mappedNodes = {};
          data.forEach(item => (mappedNodes[item.data.id] = item.data));
          return new NodeActions.UpdateNodesSuccess(mappedNodes);
        }),
        catchError((error: Error) =>
          of(new NodeActions.UpdateNodesFailure(error))
        )
      );
    })
  );
}
