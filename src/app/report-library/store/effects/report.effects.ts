import * as ReportActions from '../actions/report.actions';
import { ReportActionTypes } from '../actions/report.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  ReportDetailApiRespoonse,
  ReportLibraryApiResponse,
  ReportDetailApiRequest,
  ReportEntityApiRequest,
  ReportEntityApiResponse
} from '../models/report.model';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { GetReportLibraryRequestQueryParams, ReportService } from '../../services/report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { LoadReport } from '../actions/report.actions';

@Injectable()
export class ReportEffects {
  constructor(private actions$: Actions, private reportService: ReportService) {}

  @Effect()
  loadReports$ = this.actions$.pipe(
    ofType<ReportActions.LoadReports>(ReportActionTypes.LoadReports),
    map(action => action.payload),
    switchMap((queryParams: GetReportLibraryRequestQueryParams) => {
      return this.reportService.getReports(queryParams).pipe(
        switchMap((response: ReportLibraryApiResponse) => [new ReportActions.LoadReportsSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.LoadReportsFail(error)))
      );
    })
  );

  @Effect()
  loadReport$ = this.actions$.pipe(
    ofType<ReportActions.LoadReport>(ReportActionTypes.LoadReport),
    map(action => action.payload),
    switchMap((payload: { id: string; queryParams?: GetReportLibraryRequestQueryParams }) => {
      return this.reportService.getReport(payload.id, payload.queryParams).pipe(
        switchMap((response: ReportDetailApiRespoonse) => [new ReportActions.LoadReportSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.LoadReportFail(error)))
      );
    })
  );

  @Effect()
  addReport$ = this.actions$.pipe(
    ofType<ReportActions.AddReport>(ReportActionTypes.AddReport),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; request: ReportDetailApiRequest }) => {
      return this.reportService.addReport(payload.workPackageId, payload.request).pipe(
        mergeMap((report: ReportDetailApiRespoonse) => [new ReportActions.AddReportSuccess(report)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.AddReportFail(error)))
      );
    })
  );

  @Effect()
  updateReport$ = this.actions$.pipe(
    ofType<ReportActions.UpdateReport>(ReportActionTypes.UpdateReport),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; reportId: string; request: ReportEntityApiRequest }) => {
      return this.reportService.updateReport(payload.workPackageId, payload.reportId, payload.request).pipe(
        switchMap((response: ReportEntityApiResponse) => [
          new ReportActions.UpdateReportSuccess(response),
          new LoadReport({ id: payload.reportId, queryParams: { workPackageQuery: [payload.workPackageId] } })
        ]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.UpdateReportFail(error)))
      );
    })
  );

  @Effect()
  deleteReport$ = this.actions$.pipe(
    ofType<ReportActions.DeleteReport>(ReportActionTypes.DeleteReport),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string }) => {
      return this.reportService.deleteReport(payload.workPackageId, payload.reportId).pipe(
        map(response => new ReportActions.DeleteReportSuccess(response.data)),
        catchError((error: HttpErrorResponse) => of(new ReportActions.DeleteReportFail(error)))
      );
    })
  );

  @Effect()
  addOwner$ = this.actions$.pipe(
    ofType<ReportActions.AddOwner>(ReportActionTypes.AddOwner),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string; ownerId: string }) => {
      return this.reportService.addOwner(payload.workPackageId, payload.reportId, payload.ownerId).pipe(
        mergeMap((response: ReportDetailApiRespoonse) => [new ReportActions.AddOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.AddOwnerFail(error)))
      );
    })
  );

  @Effect()
  deleteOwner$ = this.actions$.pipe(
    ofType<ReportActions.DeleteOwner>(ReportActionTypes.DeleteOwner),
    map(action => action.payload),
    switchMap((payload: { workPackageId: string; reportId: string; ownerId: string }) => {
      return this.reportService.deleteOwner(payload.workPackageId, payload.reportId, payload.ownerId).pipe(
        switchMap((response: ReportDetailApiRespoonse) => [new ReportActions.DeleteOwnerSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.DeleteOwnerFail(error)))
      );
    })
  );

  @Effect()
  addDataSetToReport$ = this.actions$.pipe(
    ofType<ReportActions.AddDataSetsToReport>(ReportActionTypes.AddDataSetsToReport),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string; ids: { id: string }[] }) => {
      return this.reportService.addDataSets(payload.workPackageId, payload.reportId, payload.ids).pipe(
        mergeMap((response: ReportDetailApiRespoonse) => [new ReportActions.AddDataSetsToReportSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.AddDataSetsToReportFail(error)))
      );
    })
  );

  @Effect()
  removeDataSetFromReport$ = this.actions$.pipe(
    ofType<ReportActions.RemoveDataSetsFromReport>(ReportActionTypes.RemoveDataSetsFromReport),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string; dataSetId: string }) => {
      return this.reportService.removeDataSet(payload.workPackageId, payload.reportId, payload.dataSetId).pipe(
        mergeMap((response: ReportDetailApiRespoonse) => [
          new ReportActions.RemoveDataSetsFromReportSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.RemoveDataSetsFromReportFail(error)))
      );
    })
  );

  @Effect()
  setDimensionFilter$ = this.actions$.pipe(
    ofType<ReportActions.SetDimensionFilter>(ReportActionTypes.SetDimensionFilter),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string; dimensionId: string; filter: string }) => {
      return this.reportService
        .updateDimensionFilter(payload.workPackageId, payload.reportId, payload.dimensionId, payload.filter)
        .pipe(
          mergeMap((response: ReportDetailApiRespoonse) => [
            new ReportActions.SetDimensionFilterSuccess(response.data)
          ]),
          catchError((error: HttpErrorResponse) => of(new ReportActions.SetDimensionFilterFail(error)))
        );
    })
  );

  @Effect()
  addReportingConcept$ = this.actions$.pipe(
    ofType<ReportActions.AddReportingConcepts>(ReportActionTypes.AddReportingConcepts),
    map(action => action.payload),
    mergeMap(
      (payload: { workPackageId: string; reportId: string; dimensionId: string; concepts: { id: string }[] }) => {
        return this.reportService
          .addReportingConcepts(payload.workPackageId, payload.reportId, payload.dimensionId, payload.concepts)
          .pipe(
            mergeMap((response: ReportDetailApiRespoonse) => [
              new ReportActions.AddReportingConceptsSuccess(response.data)
            ]),
            catchError((error: HttpErrorResponse) => of(new ReportActions.AddReportingConceptsFail(error)))
          );
      }
    )
  );

  @Effect()
  deleteReportingConcept$ = this.actions$.pipe(
    ofType<ReportActions.DeleteReportingConcept>(ReportActionTypes.DeleteReportingConcept),
    map(action => action.payload),
    mergeMap((payload: { workPackageId: string; reportId: string; dimensionId: string; conceptId: string }) => {
      return this.reportService
        .deleteReportingConcept(payload.workPackageId, payload.reportId, payload.dimensionId, payload.conceptId)
        .pipe(
          mergeMap((response: ReportDetailApiRespoonse) => [
            new ReportActions.DeleteReportingConceptSuccess(response.data)
          ]),
          catchError((error: HttpErrorResponse) => of(new ReportActions.DeleteReportingConceptFail(error)))
        );
    })
  );
}
