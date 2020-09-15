import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScopeService } from '../../services/scope.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ScopeActions from '../actions/scope.actions';
import * as LayoutActions from '@app/layout/store/actions/layout.actions';
import { ScopeActionTypes } from '../actions/scope.actions';
import {
  ScopeEntitiesHttpParams,
  GetScopeEntitiesApiResponse,
  GetScopeApiResponse,
  ScopeDetails,
  AddScopeApiResponse,
  UpdateScopeApiResponse
} from '../models/scope.model';

@Injectable()
export class ScopeEffects {
  constructor(private actions$: Actions, private scopeService: ScopeService) {}

  @Effect()
  loadScopes$ = this.actions$.pipe(
    ofType<ScopeActions.LoadScopes>(ScopeActionTypes.LoadScopes),
    map(action => action.payload),
    switchMap((payload: ScopeEntitiesHttpParams) => {
      return this.scopeService.getScopes(payload).pipe(
        switchMap((resp: GetScopeEntitiesApiResponse) => [new ScopeActions.LoadScopesSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.LoadScopesFailure(error)))
      );
    })
  );

  @Effect()
  loadScope$ = this.actions$.pipe(
    ofType<ScopeActions.LoadScope>(ScopeActionTypes.LoadScope),
    map(action => action.payload),
    switchMap((payload: string) => {
      return this.scopeService.getScope(payload).pipe(
        switchMap((resp: GetScopeApiResponse) => {
          const actions: any[] = [new ScopeActions.LoadScopeSuccess(resp)];
          if (resp.data && resp.data.defaultLayout) {
            actions.push(new LayoutActions.LoadLayout(resp.data.defaultLayout));
          }
          return actions;
        }),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.LoadScopeFailure(error)))
      );
    })
  );

  @Effect()
  addScope$ = this.actions$.pipe(
    ofType<ScopeActions.AddScope>(ScopeActionTypes.AddScope),
    map(action => action.payload),
    switchMap((payload: ScopeDetails) => {
      return this.scopeService.addScope(payload).pipe(
        switchMap((resp: AddScopeApiResponse) => [new ScopeActions.AddScopeSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.AddScopeFailure(error)))
      );
    })
  );

  @Effect()
  updateScope$ = this.actions$.pipe(
    ofType<ScopeActions.UpdateScope>(ScopeActionTypes.UpdateScope),
    map(action => action.payload),
    switchMap((payload: { id: string; data: ScopeDetails }) => {
      return this.scopeService.updateScope(payload.id, payload.data).pipe(
        switchMap((resp: UpdateScopeApiResponse) => [new ScopeActions.UpdateScopeSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.UpdateScopeFailure(error)))
      );
    })
  );

  @Effect()
  deleteScope$ = this.actions$.pipe(
    ofType<ScopeActions.DeleteScope>(ScopeActionTypes.DeleteScope),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.scopeService.deleteScope(id).pipe(
        switchMap(_ => [new ScopeActions.DeleteScopeSuccess(id)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.DeleteScopeFailure(error)))
      );
    })
  );

  @Effect()
  addScopeNodes$ = this.actions$.pipe(
    ofType<ScopeActions.AddScopeNodes>(ScopeActionTypes.AddScopeNodes),
    map(action => action.payload),
    switchMap((payload: { scopeId: string; data: string[] }) => {
      return this.scopeService.addScopeNodes(payload.scopeId, payload.data).pipe(
        switchMap((resp: any) => [new ScopeActions.AddScopeNodesSuccess(resp)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.AddScopeNodesFailure(error)))
      );
    })
  );

  @Effect()
  setScopeAsFavourite$ = this.actions$.pipe(
    ofType<ScopeActions.SetScopeAsFavourite>(ScopeActionTypes.SetScopeAsFavourite),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.scopeService.setScopeAsFavourite(id).pipe(
        map(_ => new ScopeActions.SetScopeAsFavouriteSuccess(id)),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.SetScopeAsFavouriteFailure(error)))
      );
    })
  );

  @Effect()
  unsetScopeAsFavourite$ = this.actions$.pipe(
    ofType<ScopeActions.UnsetScopeAsFavourite>(ScopeActionTypes.UnsetScopeAsFavourite),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.scopeService.unsetScopeAsFavourite(id).pipe(
        map(_ => new ScopeActions.UnsetScopeAsFavouriteSuccess(id)),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.UnsetScopeAsFavouriteFailure(error)))
      );
    })
  );

  @Effect()
  setPreferredLayout$ = this.actions$.pipe(
    ofType<ScopeActions.SetPreferredLayout>(ScopeActionTypes.SetPreferredLayout),
    map(action => action.payload),
    switchMap((payload: { scopeId: string, layoutId: string }) => {
      return this.scopeService.setPreferredLayout(payload.scopeId, payload.layoutId).pipe(
        switchMap((response: { data: ScopeDetails }) => [new ScopeActions.SetPreferredLayoutSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.SetPreferredLayoutFailure(error)))
      );
    })
  );

  @Effect()
  unsetPreferredLayout$ = this.actions$.pipe(
    ofType<ScopeActions.UnsetPreferredLayout>(ScopeActionTypes.UnsetPreferredLayout),
    map(action => action.payload),
    switchMap((payload: { scopeId: string }) => {
      return this.scopeService.unsetPreferredLayout(payload.scopeId).pipe(
        switchMap((response: { data: ScopeDetails }) => [new ScopeActions.UnsetPreferredLayoutSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ScopeActions.UnsetPreferredLayoutFailure(error)))
      );
    })
  );
}
