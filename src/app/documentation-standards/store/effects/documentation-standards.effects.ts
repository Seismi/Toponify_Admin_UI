import * as DocumentationStandardActions from '../actions/documentation-standards.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DocumentationStandardsService } from '@app/documentation-standards/services/dcoumentation-standards.service';
import {
  DocumentStandardsApiResponse,
  DocumentStandardApiResponse,
  DocumentStandardApiRequest,
  DocumentStandardsApiRequest
} from '../models/documentation-standards.model';
import { DocumentationStandardActionTypes } from '../actions/documentation-standards.actions';

@Injectable()
export class DocumentationStandardEffects {
  constructor(private actions$: Actions, private documentationStandardsService: DocumentationStandardsService) {}

  @Effect()
  loadDoucmentationStandards$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.LoadDocumentationStandards>(
      DocumentationStandardActionTypes.LoadDocumentationStandards
    ),
    map(action => action.payload),
    switchMap((queryParams: DocumentStandardsApiRequest) => {
      return this.documentationStandardsService.getCustomProperties(queryParams).pipe(
        switchMap((customProperties: DocumentStandardsApiResponse) => [
          new DocumentationStandardActions.LoadDocumentationStandardsSuccess(customProperties)
        ]),
        catchError((error: HttpErrorResponse) =>
          of(new DocumentationStandardActions.LoadDocumentationStandardsFailure(error))
        )
      );
    })
  );

  @Effect()
  loadDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.LoadDocumentationStandard>(
      DocumentationStandardActionTypes.LoadDocumentationStandard
    ),
    map(action => action.payload),
    switchMap((id: string) => {
      return this.documentationStandardsService.getCustomProperty(id).pipe(
        switchMap((response: DocumentStandardApiResponse) => [
          new DocumentationStandardActions.LoadDocumentationStandardSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) =>
          of(new DocumentationStandardActions.LoadDocumentationStandardFailure(error))
        )
      );
    })
  );

  @Effect()
  addDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.AddDocumentationStandard>(
      DocumentationStandardActionTypes.AddDocumentationStandard
    ),
    map(action => action.payload),
    mergeMap((payload: DocumentStandardApiRequest) => {
      return this.documentationStandardsService.addCustomProperty(payload).pipe(
        mergeMap((response: DocumentStandardApiResponse) => [
          new DocumentationStandardActions.AddDocumentationStandardSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) =>
          of(new DocumentationStandardActions.AddDocumentationStandardFailure(error))
        )
      );
    })
  );

  @Effect()
  updateDocumentationdtandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.UpdateDocumentationStandard>(
      DocumentationStandardActionTypes.UpdateDocumentationStandard
    ),
    map(action => action.payload),
    mergeMap((payload: { id: string; data: DocumentStandardApiRequest }) => {
      return this.documentationStandardsService.updateCustomeProperty(payload.id, payload.data).pipe(
        mergeMap((response: DocumentStandardApiResponse) => [
          new DocumentationStandardActions.UpdateDocumentationStandardSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) =>
          of(new DocumentationStandardActions.UpdateDocumentationStandardFailure(error))
        )
      );
    })
  );

  @Effect()
  deleteDocumentationStandard$ = this.actions$.pipe(
    ofType<DocumentationStandardActions.DeleteDocumentationStandard>(
      DocumentationStandardActionTypes.DeleteDocumentationStandard
    ),
    map(action => action.payload),
    mergeMap((payload: string) => {
      return this.documentationStandardsService.deleteCustomPorperty(payload).pipe(
        mergeMap(_ => [new DocumentationStandardActions.DeleteDocumentationStandardSuccess(payload)]),
        catchError((error: HttpErrorResponse) =>
          of(new DocumentationStandardActions.DeleteDocumentationStandardFailure(error))
        )
      );
    })
  );
}
