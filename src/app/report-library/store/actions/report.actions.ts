import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Report, ReportLibraryApiResponse, ReportDetailApiRequest, ReportEntityApiRequest, ReportEntityApiResponse, ReportDetailApiRespoonse } from '../models/report.model';

export enum ReportActionTypes {
  LoadReports = '[Report] Load Reports',
  LoadReportsSuccess = '[Report] Load Reports Success',
  LoadReportsFail = '[Report] Load Reports Fail',

  LoadReport = '[Report] Load Report',
  LoadReportSuccess = '[Report] Load Report Success',
  LoadReportFail = '[Report] Load Report Fail',

  AddReport = '[Report] Add Report',
  AddReportSuccess = '[Report] Add Report Success',
  AddReportFail = '[Report] Add Report Fail',

  UpdateReport = '[Report] Update Report',
  UpdateReportSuccess = '[Report] Update Report Success',
  UpdateReportFail = '[Report] Update Report Fail',

  DeleteReport = '[Report] Delete Report',
  DeleteReportSuccess = '[Report] Delete Report Success',
  DeleteReportFail = '[Report] Delete Report Fail',

  AddOwner = '[Report] Add Owner',
  AddOwnerSuccess = '[Report] Add Owner Success',
  AddOwnerFail = '[Report] Add Owner Fail',

  DeleteOwner = '[Report] Delete Owner',
  DeleteOwnerSuccess = '[Report] Delete Owner Success',
  DeleteOwnerFail = '[Report] Delete Owner Fail'
}

export class LoadReports implements Action {
  readonly type = ReportActionTypes.LoadReports;
  constructor(public payload?: any) {}
}

export class LoadReportsSuccess implements Action {
  readonly type = ReportActionTypes.LoadReportsSuccess;
  constructor(public payload: ReportLibraryApiResponse) {}
}

export class LoadReportsFail implements Action {
  readonly type = ReportActionTypes.LoadReportsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadReport implements Action {
  readonly type = ReportActionTypes.LoadReport;
  constructor(public payload: { id: string; queryParams?: any }) {}
}

export class LoadReportSuccess implements Action {
  readonly type = ReportActionTypes.LoadReportSuccess;
  constructor(public payload: Report) {}
}

export class LoadReportFail implements Action {
  readonly type = ReportActionTypes.LoadReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddReport implements Action {
  readonly type = ReportActionTypes.AddReport;
  constructor(public payload: { workPackageId: string, request: ReportDetailApiRequest }) {}
}

export class AddReportSuccess implements Action {
  readonly type = ReportActionTypes.AddReportSuccess;
  constructor(public payload: ReportDetailApiRespoonse ) {}
}

export class AddReportFail implements Action {
  readonly type = ReportActionTypes.AddReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateReport implements Action {
  readonly type = ReportActionTypes.UpdateReport;
  constructor(public payload: { workPackageId: string, reportId: string, request: ReportEntityApiRequest }) {}
}

export class UpdateReportSuccess implements Action {
  readonly type = ReportActionTypes.UpdateReportSuccess;
  constructor(public payload: ReportEntityApiResponse) {}
}

export class UpdateReportFail implements Action {
  readonly type = ReportActionTypes.UpdateReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteReport implements Action {
  readonly type = ReportActionTypes.DeleteReport;
  constructor(public payload: { workPackageId: string, reportId: string }) {}
}

export class DeleteReportSuccess implements Action {
  readonly type = ReportActionTypes.DeleteReportSuccess;
  constructor(public payload: Report) {}
}

export class DeleteReportFail implements Action {
  readonly type = ReportActionTypes.DeleteReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddOwner implements Action {
  readonly type = ReportActionTypes.AddOwner;
  constructor(public payload: { workPackageId: string, reportId: string, ownerId: string }) {}
}

export class AddOwnerSuccess implements Action {
  readonly type = ReportActionTypes.AddOwnerSuccess;
  constructor(public payload: Report) {}
}

export class AddOwnerFail implements Action {
  readonly type = ReportActionTypes.AddOwnerFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteOwner implements Action {
  readonly type = ReportActionTypes.DeleteOwner;
  constructor(public payload: { workPackageId: string, reportId: string, ownerId: string }) {}
}

export class DeleteOwnerSuccess implements Action {
  readonly type = ReportActionTypes.DeleteOwnerSuccess;
  constructor(public payload: Report) {}
}

export class DeleteOwnerFail implements Action {
  readonly type = ReportActionTypes.DeleteOwnerFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type ReportActionsUnion =
  | LoadReports
  | LoadReportsSuccess
  | LoadReportsFail
  | LoadReport
  | LoadReportSuccess
  | LoadReportFail
  | AddReport
  | AddReportSuccess
  | AddReportFail
  | UpdateReport
  | UpdateReportSuccess
  | UpdateReportFail
  | DeleteReport
  | DeleteReportSuccess
  | DeleteReportFail
  | AddOwner
  | AddOwnerSuccess
  | AddOwnerFail
  | DeleteOwner
  | DeleteOwnerSuccess
  | DeleteOwnerFail;
