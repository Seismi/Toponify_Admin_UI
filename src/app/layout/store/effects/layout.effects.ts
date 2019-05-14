import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LayoutService } from '@app/layout/services/layout.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as LayoutActions from '../actions/layout.actions';
import { LayoutActionTypes } from '../actions/layout.actions';
import { AddLayoutApiResponse, GetLayoutApiResponse, GetLayoutEntitiesApiResponse,
  LayoutDetails, LayoutEntitiesHttpParams, UpdateLayoutApiResponse } from '../models/layout.model';


@Injectable()
export class LayoutEffects {
  constructor(
    private actions$: Actions,
    private layoutService: LayoutService
  ) {}

  @Effect()
  loadLayouts$ = this.actions$.pipe(
    ofType<LayoutActions.LoadLayouts>(LayoutActionTypes.LoadLayouts),
    map(action => action.payload),
    switchMap((payload: LayoutEntitiesHttpParams) => {
      return this.layoutService.getLayouts(payload).pipe(
        switchMap((resp: GetLayoutEntitiesApiResponse) => [new LayoutActions.LoadLayoutsSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new LayoutActions.LoadLayoutsFailure(error)))
      );
    })
  );

  @Effect()
  loadLayout$ = this.actions$.pipe(
    ofType<LayoutActions.LoadLayout>(LayoutActionTypes.LoadLayout),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.layoutService.getLayout(payload).pipe(
        switchMap((resp: GetLayoutApiResponse) => [new LayoutActions.LoadLayoutSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new LayoutActions.LoadLayoutFailure(error)))
      );
    })
  );

  @Effect()
  addlayout$ = this.actions$.pipe(
    ofType<LayoutActions.AddLayout>(LayoutActionTypes.AddLayout),
    map(action => action.payload),
    switchMap((payload: LayoutDetails) => {
      return this.layoutService.addLayout(payload).pipe(
        switchMap((resp: AddLayoutApiResponse) => [new LayoutActions.AddLayoutSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new LayoutActions.AddLayoutFailure(error)))
      );
    })
  );

  @Effect()
  updateLayout$ = this.actions$.pipe(
    ofType<LayoutActions.UpdateLayout>(LayoutActionTypes.UpdateLayout),
    map(action => action.payload),
    switchMap((payload: {id: string, data: LayoutDetails}) => {
      return this.layoutService.updateLayout(payload.id, payload.data).pipe(
        switchMap((resp: UpdateLayoutApiResponse) => [new LayoutActions.UpdateLayoutSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new LayoutActions.UpdateLayoutFailure(error)))
      );
    })
  );

  @Effect()
  deleteLayout$ = this.actions$.pipe(
    ofType<LayoutActions.DeleteLayout>(LayoutActionTypes.DeleteLayout),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.layoutService.deleteLayout(id).pipe(
        switchMap(_ => [new LayoutActions.DeleteLayoutSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new LayoutActions.DeleteLayoutFailure(error)))
      );
    })
  );
}
