import * as RadioActions from '../actions/radio.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AddReplyRadioApiResponse,
  ArchiveRadioApiResponse,
  RadioApiResponse
  } from '../models/radio.model';
import {
  catchError,
  map,
  mergeMap,
  switchMap
  } from 'rxjs/operators';
import { RadioActionTypes } from '../actions/radio.actions';
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
  loadRadio$ = this.actions$.pipe(
    ofType<RadioActions.LoadRadio>(RadioActionTypes.LoadRadio),
    switchMap(_ => {
      return this.radioService.getRadio().pipe(
        switchMap((radio: RadioApiResponse) => [new RadioActions.LoadRadioSuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new RadioActions.LoadRadioFail(error)))
      );
    })
  );

  @Effect()
  loadReplyRadio$ = this.actions$.pipe(
    ofType<RadioActions.LoadReplyRadio>(RadioActionTypes.LoadReplyRadio),
    map(action => action.payload),
    switchMap((payload: any) => {
      return this.radioService.getReplyRadio().pipe(
        switchMap((response: any) => [new RadioActions.LoadReplyRadioSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new RadioActions.LoadReplyRadioFail(error)))
      );
    })
  );

  @Effect()
  addRadio$ = this.actions$.pipe(
    ofType<RadioActions.AddRadio>(RadioActionTypes.AddRadio),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.radioService.addRadio(payload).pipe(
        mergeMap((radio: any) => [new RadioActions.AddRadioSuccess(radio.data)]),
        catchError((error: HttpErrorResponse) => of(new RadioActions.AddRadioFail(error)))
      );
    })
  );

  @Effect()
  replyRadio$ = this.actions$.pipe(
    ofType<RadioActions.ReplyRadio>(RadioActionTypes.ReplyRadio),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.radioService.addReplyRadio(payload).pipe(
        mergeMap((comment: AddReplyRadioApiResponse) => [new RadioActions.ReplyRadioSuccess(comment.data)]),
        catchError((error: HttpErrorResponse) => of(new RadioActions.ReplyRadioFail(error)))
      );
    })
  );

  @Effect()
  archiveRadio$ = this.actions$.pipe(
    ofType<RadioActions.ArchiveRadio>(RadioActionTypes.ArchiveRadio),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.radioService.archiveRadio(payload).pipe(
        mergeMap((comment: ArchiveRadioApiResponse) => [new RadioActions.ArchiveRadioSuccess(comment.data)]),
        catchError((error: HttpErrorResponse) => of(new RadioActions.ArchiveRadioFail(error)))
      );
    })
  );
}
