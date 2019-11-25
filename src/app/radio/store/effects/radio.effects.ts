import { Actions, Effect, ofType } from '@ngrx/effects';
import { RadioEntitiesHttpParams, RadioEntitiesResponse, RadioDetailApiResponse, RadioApiRequest, RadioApiResponse, ReplyApiRequest, AdvancedSearchApiRequest } from '../models/radio.model';
import { catchError, map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { RadioActionTypes, LoadRadios, LoadRadiosSuccess, LoadRadiosFailure, LoadRadio, LoadRadioSuccess, LoadRadioFailure, AddRadioEntity, AddRadioEntitySuccess, AddRadioEntityFailure, AddReply, AddReplySuccess, UpdateRadioProperty, UpdateRadioPropertySuccess, UpdateRadioPropertyFailure, DeleteRadioProperty, DeleteRadioPropertySuccess, DeleteRadioPropertyFailure, SearchRadio, SearchRadioSuccess, SearchRadioFailure } from '../actions/radio.actions';
import { RadioService } from '../../services/radio.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';


@Injectable()
export class RadioEffects {
  constructor(
    private actions$: Actions,
    private radioService: RadioService
  ) { }

  // Newly created radio id
  public radioId: string;

  @Effect()
  loadRadioEntities$ = this.actions$.pipe(
    ofType<LoadRadios>(RadioActionTypes.LoadRadios),
    map(action => action.payload),
    switchMap((payload: RadioEntitiesHttpParams) => {
      return this.radioService.getRadioEntities(payload).pipe(
        switchMap((data: RadioEntitiesResponse) => [new LoadRadiosSuccess(data)]),
        catchError((error: HttpErrorResponse) => of(new LoadRadiosFailure(error)))
      );
    })
  );

  @Effect()
  loadRadio$ = this.actions$.pipe(
    ofType<LoadRadio>(RadioActionTypes.LoadRadio),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.radioService.getRadio(id).pipe(
        switchMap((response: RadioDetailApiResponse) => [new LoadRadioSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new LoadRadioFailure(error)))
      );
    })
  );

  @Effect()
  addRadioEntity$ = this.actions$.pipe(
    ofType<AddRadioEntity>(RadioActionTypes.AddRadio),
    map(action => action.payload),
    mergeMap((payload: RadioApiRequest) => {
      return this.radioService.addRadioEntity(payload).pipe(
        mergeMap((radio: RadioApiResponse) => [new AddRadioEntitySuccess(radio.data)]),
        tap(({payload}) => { this.radioId = payload.id }),
        catchError((error: HttpErrorResponse) => of(new AddRadioEntityFailure(error)))
      );
    })
  );

  @Effect()
  addReply$ = this.actions$.pipe(
    ofType<AddReply>(RadioActionTypes.AddReply),
    map(action => action.payload),
    mergeMap((payload: {entity: ReplyApiRequest, id: string}) => {
      return this.radioService.addRadioReply(payload.entity, payload.id).pipe(
        mergeMap((radio: any) => [new AddReplySuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioEntityFailure(error)))
      );
    })
  );

  @Effect()
  updateRadioProperty$ = this.actions$.pipe(
    ofType<UpdateRadioProperty>(RadioActionTypes.UpdateRadioProperty),
    map(action => action.payload),
    switchMap((payload: { radioId: string, customPropertyId: string, data: any }) => {
      return this.radioService.updateRadioProperty(payload.radioId, payload.customPropertyId, payload.data).pipe(
        switchMap((response: RadioDetailApiResponse) => [new UpdateRadioPropertySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new UpdateRadioPropertyFailure(error)))
      );
    })
  );

  @Effect()
  deleteRadioProperty$ = this.actions$.pipe(
    ofType<DeleteRadioProperty>(RadioActionTypes.DeleteRadioProperty),
    map(action => action.payload),
    switchMap((payload: { radioId: string, customPropertyId: string }) => {
      return this.radioService.deleteRadioProperty(payload.radioId, payload.customPropertyId).pipe(
        switchMap((response: RadioDetailApiResponse) => [new DeleteRadioPropertySuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DeleteRadioPropertyFailure(error)))
      );
    })
  );

  @Effect()
  searchRadio$ = this.actions$.pipe(
    ofType<SearchRadio>(RadioActionTypes.SearchRadio),
    map(action => action.payload),
    mergeMap((payload: AdvancedSearchApiRequest) => {
      return this.radioService.searchRadio(payload).pipe(
        mergeMap((response: RadioEntitiesResponse) => [new SearchRadioSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new SearchRadioFailure(error)))
      );
    })
  );

}