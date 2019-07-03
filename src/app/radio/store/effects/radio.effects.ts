import { Actions, Effect, ofType } from '@ngrx/effects';
import { RadioEntitiesHttpParams, RadioEntitiesResponse, RadioDetailApiResponse, RadioApiRequest, RadioApiResponse, ReplyApiRequest, ReplyApiResponse } from '../models/radio.model';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { RadioActionTypes, LoadRadios, LoadRadiosSuccess, LoadRadiosFailure, LoadRadio, LoadRadioSuccess, LoadRadioFailure, AddRadioEntity, AddRadioEntitySuccess, AddRadioEntityFailure, AddReply, AddReplySuccess } from '../actions/radio.actions';
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
        mergeMap((radio: ReplyApiResponse) => [new AddReplySuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new AddRadioEntityFailure(error)))
      );
    })
  );
}