import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as NodeActions from '../actions/node.actions';
import { NodeActionTypes } from '../actions/node.actions';
import { forkJoin, of } from 'rxjs';
import {
  GetLinksRequestQueryParams,
  GetNodesRequestQueryParams,
  NodeService
} from '@app/architecture/services/node.service';
import {
  CustomPropertyApiRequest,
  Error,
  NodeApiResponse,
  NodeDetailApiResponse,
  NodesApiResponse,
  NodeUpdatePayload
} from '../models/node.model';
import {
  LinkUpdatePayload,
  NodeLinkDetailApiResponse,
  NodeLinksApiResponse
} from '../models/node-link.model';

@Injectable()
export class NodeEffects {
  constructor(private actions$: Actions, private nodeService: NodeService) {}

  @Effect()
  loadNodes$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodes>(NodeActionTypes.LoadNodes),
    map(action => action.payload),
    switchMap((queryParams: GetNodesRequestQueryParams) => {
      return this.nodeService.getNodes(queryParams).pipe(
        switchMap((nodes: NodesApiResponse) => [
          new NodeActions.LoadNodesSuccess(nodes.data)
        ]),
        catchError((error: Error) =>
          of(new NodeActions.LoadNodesFailure(error))
        )
      );
    })
  );

  @Effect()
  loadNodeLinks$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLinks>(NodeActionTypes.LoadNodeLinks),
    map(action => action.payload),
    switchMap((queryParams: GetNodesRequestQueryParams) => {
      return this.nodeService.getNodeLinks(queryParams).pipe(
        switchMap((nodeLinks: NodeLinksApiResponse) => [
          new NodeActions.LoadNodeLinksSuccess(nodeLinks.data)
        ]),
        catchError((error: Error) =>
          of(new NodeActions.LoadNodeLinksFailure(error))
        )
      );
    })
  );

  @Effect()
  loadNode$ = this.actions$.pipe(
    ofType<NodeActions.LoadNode>(NodeActionTypes.LoadNode),
    map(action => action.payload),
    switchMap(
      (payload: { id: string; queryParams?: GetNodesRequestQueryParams }) => {
        return this.nodeService.getNode(payload.id, payload.queryParams).pipe(
          switchMap((node: NodeDetailApiResponse) => [
            new NodeActions.LoadNodeSuccess(node.data)
          ]),
          catchError((error: Error) =>
            of(new NodeActions.LoadNodeFailure(error))
          )
        );
      }
    )
  );

  @Effect()
  loadNodeLink$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLink>(NodeActionTypes.LoadNodeLink),
    map(action => action.payload),
    switchMap(
      (payload: { id: string; queryParams?: GetLinksRequestQueryParams }) => {
        return this.nodeService
          .getNodeLink(payload.id, payload.queryParams)
          .pipe(
            switchMap((nodeLink: NodeLinkDetailApiResponse) => [
              new NodeActions.LoadNodeLinkSuccess(nodeLink.data)
            ]),
            catchError((error: Error) =>
              of(new NodeActions.LoadNodeLinkFailure(error))
            )
          );
      }
    )
  );

  @Effect()
  loadMapView$ = this.actions$.pipe(
    ofType<NodeActions.LoadMapView>(NodeActionTypes.LoadMapView),
    map(action => action.payload),
    switchMap((payload) => {
      return this.nodeService.getMapView(payload.id, payload.queryParams).pipe(
        switchMap((data: any) => [
          new NodeActions.LoadMapViewSuccess(data.data)
        ]),
        catchError((error: Error) =>
          of(new NodeActions.LoadMapViewFailure(error))
        )
      );
    })
  );

  @Effect()
  loadNodeUsageView$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeUsageView>(NodeActionTypes.LoadNodeUsageView),
    map(action => action.payload),
    switchMap(
      (payload: { node: string; query: { workPackageQuery: string[] } }) => {
        return this.nodeService
          .getNodeUsageView(payload.node, payload.query)
          .pipe(
            switchMap((data: any) => [
              new NodeActions.LoadNodeUsageViewSuccess(data.data)
            ]),
            catchError((error: Error) =>
              of(new NodeActions.LoadNodeUsageViewFailure(error))
            )
          );
      }
    )
  );

  @Effect()
  updateLinks$ = this.actions$.pipe(
    ofType<NodeActions.UpdateLinks>(NodeActionTypes.UpdateLinks),
    map(action => action.payload),
    switchMap((payload: LinkUpdatePayload) => {
      const observables = payload.links.map((item: any) => {
        return this.nodeService.updateLayoutNodeLinksRoute(
          payload.layoutId,
          item
        );
      });

      return forkJoin(observables).pipe(
        map(data => {
          const mappedLinks = {};
          data.forEach(item => (mappedLinks[item.data.id] = item.data));
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

  @Effect()
  updateCustomProperty$ = this.actions$.pipe(
    ofType<NodeActions.UpdateCustomProperty>(
      NodeActionTypes.UpdateCustomProperty
    ),
    map(action => action.payload),
    switchMap(
      (payload: {
        workPackageId: string;
        nodeId: string;
        customPropertyId: string;
        data: CustomPropertyApiRequest;
      }) => {
        return this.nodeService
          .updateCustomPropertyValues(
            payload.workPackageId,
            payload.nodeId,
            payload.customPropertyId,
            payload.data
          )
          .pipe(
            switchMap((response: NodeApiResponse) => [
              new NodeActions.UpdateCustomPropertySuccess(response.data)
            ]),
            catchError((error: Error) =>
              of(new NodeActions.UpdateCustomPropertyFailure(error))
            )
          );
      }
    )
  );
}
