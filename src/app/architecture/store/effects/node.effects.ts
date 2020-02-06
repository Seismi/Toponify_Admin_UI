import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as NodeActions from '../actions/node.actions';
import { NodeActionTypes } from '../actions/node.actions';
import { forkJoin, Observable, of } from 'rxjs';
import {
  GetLinksRequestQueryParams,
  GetNodesRequestQueryParams,
  NodeService
} from '@app/architecture/services/node.service';
import {
  NodeExpandedStateApiRequest,
  Error,
  NodeDetailApiResponse,
  NodesApiResponse,
  NodeLocationsUpdatePayload,
  NodeReportsApiResponse,
  Tag,
  NodeDetail
} from '../models/node.model';
import {
  LinkUpdatePayload,
  NodeLinkDetail,
  NodeLinkDetailApiResponse,
  NodeLinksApiResponse
} from '../models/node-link.model';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class NodeEffects {
  constructor(private actions$: Actions, private nodeService: NodeService, private snackBar: MatSnackBar) {}

  @Effect()
  loadNodes$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodes>(NodeActionTypes.LoadNodes),
    map(action => action.payload),
    switchMap((queryParams: GetNodesRequestQueryParams) => {
      return this.nodeService.getNodes(queryParams).pipe(
        switchMap((nodes: NodesApiResponse) => [new NodeActions.LoadNodesSuccess(nodes.data)]),
        catchError((error: Error) => {
          this.snackBar.open('There was error loading links!');
          return of(new NodeActions.LoadNodesFailure(error));
        })
      );
    })
  );

  @Effect()
  loadNodeLinks$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLinks>(NodeActionTypes.LoadNodeLinks),
    map(action => action.payload),
    switchMap((queryParams: GetNodesRequestQueryParams) => {
      return this.nodeService.getNodeLinks(queryParams).pipe(
        switchMap((nodeLinks: NodeLinksApiResponse) => [new NodeActions.LoadNodeLinksSuccess(nodeLinks.data)]),
        catchError((error: Error) => {
          this.snackBar.open('There was error loading links!');
          return of(new NodeActions.LoadNodeLinksFailure(error));
        })
      );
    })
  );

  @Effect()
  loadNode$ = this.actions$.pipe(
    ofType<NodeActions.LoadNode>(NodeActionTypes.LoadNode),
    map(action => action.payload),
    switchMap((payload: { id: string; queryParams?: GetNodesRequestQueryParams }) => {
      return this.nodeService.getNode(payload.id, payload.queryParams).pipe(
        switchMap((node: NodeDetailApiResponse) => [new NodeActions.LoadNodeSuccess(node.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeLink$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeLink>(NodeActionTypes.LoadNodeLink),
    map(action => action.payload),
    switchMap((payload: { id: string; queryParams?: GetLinksRequestQueryParams }) => {
      return this.nodeService.getNodeLink(payload.id, payload.queryParams).pipe(
        switchMap((nodeLink: NodeLinkDetailApiResponse) => [new NodeActions.LoadNodeLinkSuccess(nodeLink.data)]),
        catchError((error: Error) => of(new NodeActions.LoadNodeLinkFailure(error)))
      );
    })
  );

  @Effect()
  loadMapView$ = this.actions$.pipe(
    ofType<NodeActions.LoadMapView>(NodeActionTypes.LoadMapView),
    map(action => action.payload),
    switchMap(payload => {
      return this.nodeService.getMapView(payload.id, payload.queryParams).pipe(
        switchMap((data: any) => [new NodeActions.LoadMapViewSuccess(data.data)]),
        catchError((error: Error) => of(new NodeActions.LoadMapViewFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeUsageView$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeUsageView>(NodeActionTypes.LoadNodeUsageView),
    map(action => action.payload),
    switchMap((payload: { node: string; query: { workPackageQuery: string[] } }) => {
      return this.nodeService.getNodeUsageView(payload.node, payload.query).pipe(
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
          data.forEach(item => (mappedLinks[item.data.id] = item.data));
          return new NodeActions.UpdateLinksSuccess(mappedLinks);
        }),
        catchError(error => of(new NodeActions.UpdateLinksFailure(error)))
      );
    })
  );

  @Effect()
  updateNodeLocations$ = this.actions$.pipe(
    ofType<NodeActions.UpdateNodeLocations>(NodeActionTypes.UpdateNodeLocations),
    map(action => action.payload),
    switchMap((payload: NodeLocationsUpdatePayload) => {
      const observables = payload.nodes.map((item: any) => {
        return this.nodeService.updateLayoutNodesLocation(payload.layoutId, item);
      });

      return forkJoin(observables).pipe(
        map((data: any) => {
          const mappedNodes = {};
          data.forEach(item => (mappedNodes[item.data.id] = item.data));
          return new NodeActions.UpdateNodeLocationsSuccess(mappedNodes);
        }),
        catchError((error: Error) => of(new NodeActions.UpdateNodeLocationsFailure(error)))
      );
    })
  );

  @Effect()
  updateNodeExpandedState$ = this.actions$.pipe(
    ofType<NodeActions.UpdateNodeExpandedState>(NodeActionTypes.UpdateNodeExpandedState),
    map(action => action.payload),
    switchMap((payload: { layoutId: string; data: NodeExpandedStateApiRequest['data'] }) => {
      return this.nodeService.updateNodeExpandedState(payload.layoutId, payload.data).pipe(
        switchMap((response: any) => [new NodeActions.UpdateNodeExpandedStateSuccess(response.data)]),
        catchError((error: Error) => of(new NodeActions.UpdateNodeExpandedStateFailure(error)))
      );
    })
  );

  @Effect()
  loadNodeReports$ = this.actions$.pipe(
    ofType<NodeActions.LoadNodeReports>(NodeActionTypes.LoadNodeReports),
    map(action => action.payload),
    switchMap((payload: { nodeId: string; queryParams?: GetNodesRequestQueryParams }) => {
      return this.nodeService.getReports(payload.nodeId, payload.queryParams).pipe(
        switchMap((response: NodeReportsApiResponse) => [new NodeActions.LoadNodeReportsSuccess(response.data)]),
        catchError((error: Error) => {
          return of(new NodeActions.LoadNodeReportsFailure(error));
        })
      );
    })
  );

  @Effect()
  getParentDescendantIds$ = this.actions$.pipe(
    ofType<NodeActions.GetParentDescendantIds>(NodeActionTypes.GetParentDescendantIds),
    map(action => action.payload),
    switchMap(({ id, workpackages }) => {
      return this.nodeService.getNode(id, { workPackageQuery: workpackages }).pipe(
        switchMap((response: NodeDetailApiResponse) => [new NodeActions.GetParentDescendantIdsSuccess(response.data)]),
        catchError((error: Error) => {
          return of(new NodeActions.GetParentDescendantIdsFailure(error));
        })
      );
    })
  );

  @Effect()
  LoadAvailableTags$ = this.actions$.pipe(
    ofType<NodeActions.LoadAvailableTags>(NodeActionTypes.LoadAvailableTags),
    map(action => action.payload),
    switchMap((payload: { workpackageId: string; nodeId: string; type: 'node' | 'link' }) => {
      let request: Observable<{ data: Tag[] }>;
      if (payload.type === 'node') {
        request = this.nodeService.getNodeAvailableTags(payload.workpackageId, payload.nodeId);
      } else {
        request = this.nodeService.getLinkAvailableTags(payload.workpackageId, payload.nodeId);
      }
      return request.pipe(
        switchMap(response => [
          new NodeActions.LoadAvailableTagsSuccess({ tags: response.data, id: payload.workpackageId + payload.nodeId })
        ]),
        catchError((error: Error) => {
          return of(new NodeActions.LoadAvailableTagsFailure(error));
        })
      );
    })
  );

  @Effect()
  createTag$ = this.actions$.pipe(
    ofType<NodeActions.CreateTag>(NodeActionTypes.CreateTag),
    map(action => action.payload),
    switchMap(
      (payload: {
        tag: Tag;
        associateWithNode?: { workpackageId: string; type: 'node' | 'link'; nodeOrLinkId?: string };
      }) => {
        return this.nodeService.createTag(payload.tag).pipe(
          switchMap(response => {
            const successActions: any[] = [new NodeActions.CreateTagSuccess({ tag: response.data })];
            if (payload.associateWithNode) {
              successActions.push(
                new NodeActions.AssociateTag({
                  tagIds: [{ id: response.data.id }],
                  nodeOrLinkId: payload.associateWithNode.nodeOrLinkId,
                  workpackageId: payload.associateWithNode.workpackageId,
                  type: payload.associateWithNode.type
                })
              );
            }
            return successActions;
          }),
          catchError((error: Error) => {
            return of(new NodeActions.CreateTagFailure(error));
          })
        );
      }
    )
  );

  @Effect()
  associateTag$ = this.actions$.pipe(
    ofType<NodeActions.AssociateTag>(NodeActionTypes.AssociateTag),
    map(action => action.payload),
    switchMap(
      (payload: { workpackageId: string; tagIds: { id: string }[]; nodeOrLinkId: string; type: 'node' | 'link' }) => {
        let request: Observable<{ data: NodeDetail | NodeLinkDetail }>;
        if (payload.type === 'node') {
          request = this.nodeService.associateTagToNode(payload.workpackageId, payload.nodeOrLinkId, payload.tagIds);
        } else {
          request = this.nodeService.associateTagToLink(payload.workpackageId, payload.nodeOrLinkId, payload.tagIds);
        }
        return request.pipe(
          switchMap(response => [
            new NodeActions.AssociateTagSuccess({ nodeOrLinkDetail: response.data, type: payload.type })
          ]),
          catchError((error: Error) => {
            return of(new NodeActions.AssociateTagFailure(error));
          })
        );
      }
    )
  );

  @Effect()
  dissociateTag$ = this.actions$.pipe(
    ofType<NodeActions.DissociateTag>(NodeActionTypes.DissociateTag),
    map(action => action.payload),
    switchMap((payload: { workpackageId: string; tag: Tag; nodeOrLinkId: string; type: 'node' | 'link' }) => {
      let request: Observable<{ data: NodeDetail | NodeLinkDetail }>;
      if (payload.type === 'node') {
        request = this.nodeService.dissociateTagFromNode(payload.workpackageId, payload.nodeOrLinkId, payload.tag.id);
      } else {
        request = this.nodeService.dissociateTagFromLink(payload.workpackageId, payload.nodeOrLinkId, payload.tag.id);
      }
      return request.pipe(
        switchMap(response => [
          new NodeActions.DissociateTagSuccess({ nodeOrLinkDetail: response.data, type: payload.type })
        ]),
        catchError((error: Error) => {
          return of(new NodeActions.DissociateTagFailure(error));
        })
      );
    })
  );

  @Effect()
  loadTags$ = this.actions$.pipe(
    ofType<NodeActions.LoadTags>(NodeActionTypes.LoadTags),
    switchMap(() => {
      return this.nodeService.loadTags().pipe(
        switchMap(response => [new NodeActions.LoadTagsSuccess({ tags: response.data })]),
        catchError((error: Error) => {
          return of(new NodeActions.LoadTagsFailure(error));
        })
      );
    })
  );

  @Effect()
  updateTag$ = this.actions$.pipe(
    ofType<NodeActions.UpdateTag>(NodeActionTypes.UpdateTag),
    map(action => action.payload),
    switchMap((payload: { tag: Tag }) => {
      return this.nodeService.updateTag(payload.tag).pipe(
        switchMap(response => [new NodeActions.UpdateTagSuccess({ tag: response.data })]),
        catchError((error: Error) => {
          return of(new NodeActions.UpdateTagFailure(error));
        })
      );
    })
  );

  @Effect()
  deleteTag$ = this.actions$.pipe(
    ofType<NodeActions.DeleteTag>(NodeActionTypes.DeleteTag),
    map(action => action.payload),
    switchMap((payload: { tagId: string }) => {
      return this.nodeService.deleteTag(payload.tagId).pipe(
        switchMap(response => [new NodeActions.DeleteTagSuccess({ tagId: payload.tagId })]),
        catchError((error: Error) => {
          return of(new NodeActions.DeleteTagFailure(error));
        })
      );
    })
  );
}
