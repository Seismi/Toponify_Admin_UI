import { Injectable } from '@angular/core';
import { DiagramNodeService, NodeType } from '@app/version/services/diagram-node.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DimensionActionTypes, DeleteDimension } from '../actions/dimension.actions';
import { ElementActionTypes, DeleteElement } from '../actions/element.actions';
import { DeleteModel, ModelActionTypes } from '../actions/model.actions';
import * as VersionNodeActions from '../actions/node.actions';
import { DeleteVersionSystem, VersionSystemActionTypes } from '../actions/version-system.actions';


@Injectable()
export class NodeEffects {
  constructor(
    private actions$: Actions,
    private diagramNodeService: DiagramNodeService
  ) { }

  @Effect()
  loadNodeDescendants$ = this.actions$.pipe(
    ofType<VersionNodeActions.LoadNodeDescendants>(VersionNodeActions.VersionNodeActionTypes.LoadNodeDescendants),
    map(action => action.payload),
    mergeMap((payload: {versionId: string, nodeId: string, nodeType: NodeType}) => {
      return this.diagramNodeService.getVersionDescendants(payload.nodeType, payload.versionId, payload.nodeId).pipe(
        map(data => new VersionNodeActions.LoadNodeDescendantsSuccess(data.data)),
        catchError(error => of(new VersionNodeActions.LoadNodeDescendantsFailure(error)))
      );
    })
  );

  @Effect()
  deleteNode$ = this.actions$.pipe(
    ofType<VersionNodeActions.DeleteNode>(VersionNodeActions.VersionNodeActionTypes.DeleteNode),
    map(action => action.payload),
    mergeMap((payload: {versionId: string, nodeId: string, nodeType: NodeType}) => {
      switch (payload.nodeType) {
        case NodeType.System:
          return of(new DeleteVersionSystem({versionId: payload.versionId, systemId: payload.nodeId}));

        case NodeType.Model:
          return of(new DeleteModel({versionId: payload.versionId, modelId: payload.nodeId}));

        case NodeType.Dimension:
          return of(new DeleteDimension({versionId: payload.versionId, dimensionId: payload.nodeId}));

        case NodeType.Element:
          return of(new DeleteElement({versionId: payload.versionId, elementId: payload.nodeId}));

        default:
          throw new Error('Unsupported node type!');
      }
    })
  );

  @Effect()
  deleteNodeSuccess$ = this.actions$.pipe(
    ofType(
      ModelActionTypes.DeleteModelSuccess,
      DimensionActionTypes.DeleteDimensionSuccess,
      ElementActionTypes.DeleteElementSuccess,
      VersionSystemActionTypes.DeleteVersionSystemSuccess
    ),
    mergeMap((node) => {
      return of(new VersionNodeActions.DeleteNodeSuccess(node));
    })
  );

  @Effect()
  deleteNodeFailure$ = this.actions$.pipe(
    ofType(
      ModelActionTypes.DeleteModelFailure,
      DimensionActionTypes.DeleteDimensionFailure,
      ElementActionTypes.DeleteElementFailure,
      VersionSystemActionTypes.DeleteVersionSystemFailure
    ),
    mergeMap((error) => {
      return of(new VersionNodeActions.DeleteNodeFailure(error));
    })
  );

}
