import * as ReportActions from '../actions/report.actions';
import { ReportActionTypes } from '../actions/report.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  ReportDetailApiRespoonse,
  ReportLibraryApiResponse,
  ReportDetailApiRequest,
  ReportEntityApiRequest,
  ReportEntityApiResponse,
  OwnersEntity
} from '../models/report.model';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { GetReportLibraryRequestQueryParams, ReportService } from '../../services/report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

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
        switchMap((response: ReportEntityApiResponse) => [new ReportActions.UpdateReportSuccess(response)]),
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
}
