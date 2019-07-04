import * as DocumentationStandardActions from '../actions/documentation-standards.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  mergeMap,
  switchMap
  } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DocumentationStandardsService } from '@app/documentation-standards/services/dcoumentation-standards.service';
import { DocumentStandardsApiResponse, DocumentStandardApiResponse } from '../models/documentation-standards.model';
import { DocumentationStandardActionTypes } from '../actions/documentation-standards.actions';


@Injectable()
export class DocumentationStandardEffects {
  constructor(
    private actions$: Actions,
    private documentationStandardsService: DocumentationStandardsService
  ) { }

  @Effect()
  loadDoucmentationStandards$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.LoadDocumentationStandards>(DocumentationStandardActionTypes.LoadDocumentationStandards),
    switchMap(_ => {
      return this.documentationStandardsService.getCustomProperties({}).pipe(
        switchMap((customProperties: DocumentStandardsApiResponse) => [new DocumentationStandardActions.LoadDocumentationStandardsSuccess(customProperties)]),
        catchError((error: HttpErrorResponse) => of(new DocumentationStandardActions.LoadDocumentationStandardsFailure(error)))
      );
    })
  );

  @Effect()
  loadDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.LoadDocumentationStandard>(DocumentationStandardActionTypes.LoadDocumentationStandard),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.documentationStandardsService.getCustomProperty(id).pipe(
        switchMap((response: DocumentStandardApiResponse) => [new DocumentationStandardActions.LoadDocumentationStandardSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new DocumentationStandardActions.LoadDocumentationStandardFailure(error)))
      );
    })
  );

  @Effect()
  addDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.AddDocumentationStandard>(DocumentationStandardActionTypes.AddDocumentationStandard),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.documentationStandardsService.addCustomProperty(payload).pipe(
        mergeMap((response: any) => [new DocumentationStandardActions.AddDocumentationStandardSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new DocumentationStandardActions.AddDocumentationStandardSuccess(error)))
      );
    })
  );

  @Effect()
  updateDocumentationdtandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.UpdateDocumentationStandard>(DocumentationStandardActionTypes.UpdateDocumentationStandard),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.documentationStandardsService.updateCustomeProperty(payload.id, payload.data).pipe(
        mergeMap((response: any) => [new DocumentationStandardActions.UpdateDocumentationStandardSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new DocumentationStandardActions.UpdateDocumentationStandardFailure(error)))
      );
    })
  );

  @Effect()
  deleteDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.DeleteDocumentationStandard>(DocumentationStandardActionTypes.DeleteDocumentationStandard),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.documentationStandardsService.deleteCustomPorperty(payload).pipe(
        mergeMap((response: any) => [new DocumentationStandardActions.DeleteDocumentationStandardSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new DocumentationStandardActions.DeleteDocumentationStandardFailure(error)))
      );
    })
  );
}
