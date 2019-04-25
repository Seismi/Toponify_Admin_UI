import { Injectable } from '@angular/core';
import { DiagramLinkService, LinkType } from '@app/version/services/diagram-link.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DimensionLinkActionTypes } from '../actions/dimension-link.actions';
import { ElementLinkActionTypes } from '../actions/element-link.actions';
import {
  DeleteLink,
  DeleteLinkFailure,
  DeleteLinkSuccess,
  LoadLinkDescendants, LoadLinkDescendantsFailure, LoadLinkDescendantsSuccess, VersionLinkActionTypes } from '../actions/link.actions';
import { ModelLinkActionTypes, DeleteModelLink } from '../actions/model-link.actions';
import { DeleteSystemLink, SystemLinkActionTypes } from '../actions/system-link.actions';


@Injectable()
export class LinkEffects {
  constructor(
    private actions$: Actions,
    private diagramLinkService: DiagramLinkService
  ) { }

  @Effect()
  loadLinkDescendants$ = this.actions$.pipe(
    ofType<LoadLinkDescendants>(VersionLinkActionTypes.LoadLinkDescendants),
    map(action => action.payload),
    mergeMap((payload: {versionId: string, linkId: string, linkType: LinkType}) => {
      return this.diagramLinkService.getVersionDescendants(payload.linkType, payload.versionId, payload.linkId).pipe(
        map(data => new LoadLinkDescendantsSuccess(data.data)),
        catchError(error => of(new LoadLinkDescendantsFailure(error)))
      );
    })
  );

  @Effect()
  deleteLink$ = this.actions$.pipe(
    ofType<DeleteLink>(VersionLinkActionTypes.DeleteLink),
    map(action => action.payload),
    mergeMap((payload: {versionId: string, linkId: string, linkType: LinkType}) => {
      switch (payload.linkType) {
        case LinkType.System:
          return of(new DeleteSystemLink({versionId: payload.versionId, systemLinkId: payload.linkId}));

        case LinkType.Model:
          return of(new DeleteModelLink({versionId: payload.versionId, modelLinkId: payload.linkId}));

        default:
          throw new Error('Unsupported link type!');
      }
    })
  );

  @Effect()
  deleteLinkuccess$ = this.actions$.pipe(
    ofType(
      ModelLinkActionTypes.DeleteModelLinkSuccess,
      DimensionLinkActionTypes.DeleteDimensionLinkSuccess,
      ElementLinkActionTypes.DeleteElementLinkSuccess,
      SystemLinkActionTypes.DeleteSystemLinkSuccess
    ),
    mergeMap((link) => {
      return of(new DeleteLinkSuccess(link));
    })
  );

  @Effect()
  deleteLinkFailure$ = this.actions$.pipe(
    ofType(
      ModelLinkActionTypes.DeleteModelLinkFailure,
      DimensionLinkActionTypes.DeleteDimensionLinkFailure,
      ElementLinkActionTypes.DeleteElementLinkFailure,
      SystemLinkActionTypes.DeleteSystemLinkFailure
    ),
    mergeMap((error) => {
      return of(new DeleteLinkFailure(error));
    })
  );

}
