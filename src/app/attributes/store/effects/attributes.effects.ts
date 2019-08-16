import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AttributeService, GetAttributeRequestQueryParams } from '@app/attributes/services/attributes.service';
import { AttributeActionTypes, LoadAttributes, LoadAttributesSuccess, LoadAttributesFailure, LoadAttribute, LoadAttributeSuccess, LoadAttributeFailure } from '../actions/attributes.actions';
import { AttributeEntitiesHttpParams, AttributeEntitiesResponse, AttributeDetailApiResponse } from '../models/attributes.model';


@Injectable()
export class AttributeEffects {
  constructor(
    private actions$: Actions,
    private attributeService: AttributeService
  ) {}

  @Effect()
  loadAttributeEntities$ = this.actions$.pipe(
    ofType<LoadAttributes>(AttributeActionTypes.LoadAttributes),
    map(action => action.payload),
    switchMap((queryParams: GetAttributeRequestQueryParams) => {
      return this.attributeService.getAttributeEntities(queryParams).pipe(
        switchMap((data: AttributeEntitiesResponse) => [new LoadAttributesSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributesFailure(error)))
      );
    })
  );

  @Effect()
  loadAttribute$ = this.actions$.pipe(
    ofType<LoadAttribute>(AttributeActionTypes.LoadAttribute),
    map(action => action.payload),
    switchMap((payload: {id: string, queryParams?: GetAttributeRequestQueryParams}) => {
      return this.attributeService.getAttribute(payload.id, payload.queryParams).pipe(
        switchMap((response: AttributeDetailApiResponse) => [new LoadAttributeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributeFailure(error)))
      );
    })
  );

  // @Effect()
  // addAttribute$ = this.actions$.pipe(
  //   ofType<AttributeActions.AddAttribute>(AttributeActionTypes.AddAttribute),
  //   map(action => action.payload),
  //   mergeMap((payload: {attribute: AddAttributeApiRequest}) => {
  //     return this.attributeService.addAttribute(payload.attribute).pipe(
  //       switchMap((attribute: AttributeSingleApiResponse) => [new AttributeActions.AddAttributeSuccess(attribute.data)]),
  //       catchError((error: HttpErrorResponse) => of(new AttributeActions.AddAttributeFailure(error)))
  //     );
  //   })
  // );

  // @Effect()
  // updateAttribute$ = this.actions$.pipe(
  //   ofType<AttributeActions.UpdateAttribute>(AttributeActionTypes.UpdateAttribute),
  //   map(action => action.payload),
  //   mergeMap((payload: {attribute: AttributeApiRequest}) => {
  //     return this.attributeService.updateAttribute(payload.attribute).pipe(
  //       switchMap((attribute: AttributeSingleApiResponse) => [new AttributeActions.UpdateAttributeSuccess(attribute.data)]),
  //       catchError((error: HttpErrorResponse) => of(new AttributeActions.UpdateAttributeFailure(error)))
  //     );
  //   })
  // );

  // @Effect()
  // deleteAttribute$ = this.actions$.pipe(
  //   ofType<AttributeActions.DeleteAttribute>(AttributeActionTypes.DeleteAttribute),
  //   map(action => action.payload),
  //   mergeMap((attribute: {versionId: string, attributeId: string}) => {
  //     return this.attributeService.deleteAttribute(attribute.attributeId).pipe(
  //       map(_ => new AttributeActions.DeleteAttributeSuccess(attribute.attributeId)),
  //       catchError(error => of(new AttributeActions.DeleteAttributeFailure(error)))
  //     );
  //   })
  // );
}