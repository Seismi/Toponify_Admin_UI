import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as AttributeActions from '../actions/attribute.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AttributeService } from '@app/version/services/attribute.service';
import { AttributeActionTypes } from '../actions/attribute.actions';
import { AttributeApiResponse, AttributeApiRequest, AttributeSingleApiResponse, AddAttributeApiRequest } from '../models/attribute.model';


@Injectable()
export class AttributeEffects {
  constructor(
    private actions$: Actions,
    private attributeService: AttributeService
  ) {}

  @Effect()
  loadAttributes$ = this.actions$.pipe(
    ofType<AttributeActions.LoadAttributes>(AttributeActionTypes.LoadAttributes),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.attributeService.getAttributes(versionId).pipe(
        switchMap((attribute: AttributeApiResponse) =>
            [new AttributeActions.LoadAttributesSuccess(attribute.data)]),
        catchError((error: HttpErrorResponse) => of(new AttributeActions.LoadAttributesFailure(error)))
      );
    })
  );

  @Effect()
  addAttribute$ = this.actions$.pipe(
    ofType<AttributeActions.AddAttribute>(AttributeActionTypes.AddAttribute),
    map(action => action.payload),
    mergeMap((payload: {attribute: AddAttributeApiRequest, versionId: string}) => {
      return this.attributeService.addAttribute(payload.attribute, payload.versionId).pipe(
        switchMap((attribute: AttributeSingleApiResponse) => [new AttributeActions.AddAttributeSuccess(attribute.data)]),
        catchError((error: HttpErrorResponse) => of(new AttributeActions.AddAttributeFailure(error)))
      );
    })
  );

  @Effect()
  updateAttribute$ = this.actions$.pipe(
    ofType<AttributeActions.UpdateAttribute>(AttributeActionTypes.UpdateAttribute),
    map(action => action.payload),
    mergeMap((payload: {attribute: AttributeApiRequest, versionId: string}) => {
      return this.attributeService.updateAttribute(payload.attribute, payload.versionId).pipe(
        switchMap((attribute: AttributeSingleApiResponse) => [new AttributeActions.UpdateAttributeSuccess(attribute.data)]),
        catchError((error: HttpErrorResponse) => of(new AttributeActions.UpdateAttributeFailure(error)))
      );
    })
  );

  @Effect()
  deleteAttribute$ = this.actions$.pipe(
    ofType<AttributeActions.DeleteAttribute>(AttributeActionTypes.DeleteAttribute),
    map(action => action.payload),
    mergeMap((attribute: {versionId: string, attributeId: string}) => {
      return this.attributeService.deleteAttribute(attribute.versionId, attribute.attributeId).pipe(
        map(_ => new AttributeActions.DeleteAttributeSuccess(attribute.attributeId)),
        catchError(error => of(new AttributeActions.DeleteAttributeFailure(error)))
      );
    })
  );
}
