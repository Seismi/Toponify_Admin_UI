import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScopeService } from '../../services/scope.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ScopeActions from '../actions/scope.actions';
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
  constructor(
    private actions$: Actions,
    private scopeService: ScopeService
  ) {}

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
        switchMap((resp: GetScopeApiResponse) => [new ScopeActions.LoadScopeSuccess(resp)]),
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
    switchMap((payload: {id: string, data: ScopeDetails}) => {
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
}