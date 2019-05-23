import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';
import * as AttributeActions from '../actions/attributes.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AttributeService } from '@app/attributes/services/attributes.service';
import { AttributeActionTypes } from '../actions/attributes.actions';
import { AttributeApiResponse, AttributeApiRequest, AttributeSingleApiResponse, AddAttributeApiRequest } from '../models/attributes.model';


@Injectable()
export class AttributeEffects {
  constructor(
    private actions$: Actions,
    private attributeService: AttributeService
  ) {}

  @Effect()
  loadAttributes$ = this.actions$.pipe(
    ofType<AttributeActions.LoadAttributes>(AttributeActionTypes.LoadAttributes),
    switchMap(_ => {
      return this.attributeService.getAttributes().pipe(
        switchMap((attribute: AttributeApiResponse) => [new AttributeActions.LoadAttributesSuccess(attribute.data)]),
        catchError((error: HttpErrorResponse) => of(new AttributeActions.LoadAttributesFailure(error)))
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