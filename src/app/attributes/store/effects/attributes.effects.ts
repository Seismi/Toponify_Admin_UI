import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AttributeService } from '@app/attributes/services/attributes.service';
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
    switchMap((payload: AttributeEntitiesHttpParams) => {
      return this.attributeService.getAttributeEntities(payload).pipe(
        switchMap((data: AttributeEntitiesResponse) => [new LoadAttributesSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributesFailure(error)))
      );
    })
  );

  @Effect()
  loadAttribute$ = this.actions$.pipe(
    ofType<LoadAttribute>(AttributeActionTypes.LoadAttribute),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.attributeService.getAttribute(id).pipe(
        switchMap((response: AttributeDetailApiResponse) => [new LoadAttributeSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadAttributeFailure(error)))
      );
    })
  );
}