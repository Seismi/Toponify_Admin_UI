import * as ReportActions from '../actions/report.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  ReportLibraryApiResponse
  } from '../models/report.model';
import {
  catchError,
  map,
  mergeMap,
  switchMap
  } from 'rxjs/operators';
import { ReportActionTypes } from '../actions/report.actions';
import { ReportService, GetReportLibraryRequestQueryParams  } from '../../services/report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';


@Injectable()
export class ReportEffects {
  constructor(
    private actions$: Actions,
    private reportService: ReportService
  ) { }

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
    switchMap((payload: { id: string, queryParams?: GetReportLibraryRequestQueryParams }) => {
      return this.reportService.getReport(payload.id, payload.queryParams).pipe(
        switchMap((response: any) => [new ReportActions.LoadReportSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.LoadReportFail(error)))
      );
    })
  );

  @Effect()
  addReport$ = this.actions$.pipe(
    ofType<ReportActions.AddReport>(ReportActionTypes.AddReport),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.reportService.addReport(payload.workPackageId, payload.reportId).pipe(
        mergeMap((report: any) => [new ReportActions.AddReportSuccess(report.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.AddReportFail(error)))
      );
    })
  );


  @Effect()
  deleteReport$ = this.actions$.pipe(
    ofType<ReportActions.DeleteReport>(ReportActionTypes.DeleteReport),
    map(action => action.payload),
    mergeMap((payload: any) => {
      return this.reportService.deleteReport(payload.workPackageId, payload.reportId).pipe(
        mergeMap((response: any) => [new ReportActions.DeleteReportSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new ReportActions.DeleteReportFail(error)))
      );
    })
  );
}
