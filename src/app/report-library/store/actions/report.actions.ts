import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportLibrary, ReportLibraryApiResponse } from '../models/report.model';

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
    LoadReportsFailure = "LoadReportsFailure"
}

export class LoadReports implements Action {
    readonly type = ReportActionTypes.LoadReports;
    constructor(public payload?: any) { }
}

export class LoadReportsSuccess implements Action {
    readonly type = ReportActionTypes.LoadReportsSuccess;
    constructor(public payload: ReportLibraryApiResponse) { }
}

export class LoadReportsFail implements Action {
    readonly type = ReportActionTypes.LoadReportsFail;
    constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export class LoadReport implements Action {
    readonly type = ReportActionTypes.LoadReport;
    constructor(public payload: { id: string, queryParams?: any }) { }
}

export class LoadReportSuccess implements Action {
    readonly type = ReportActionTypes.LoadReportSuccess;
    constructor(public payload: ReportLibrary) { }
}

export class LoadReportFail implements Action {
    readonly type = ReportActionTypes.LoadReportFail;
    constructor(public payload: HttpErrorResponse | { message: string }) { }
}


export class AddReport implements Action {
    readonly type = ReportActionTypes.AddReport;
    constructor(public payload: any) { }
}

export class AddReportSuccess implements Action {
    readonly type = ReportActionTypes.AddReportSuccess;
    constructor(public payload: any) { }
}

export class AddReportFail implements Action {
    readonly type = ReportActionTypes.AddReportFail;
    constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export class UpdateReport implements Action {
    readonly type = ReportActionTypes.UpdateReport;
    constructor(public payload: any) { }
}

export class UpdateReportSuccess implements Action {
    readonly type = ReportActionTypes.UpdateReportSuccess;
    constructor(public payload: any) { }
}

export class UpdateReportFail implements Action {
    readonly type = ReportActionTypes.UpdateReportFail;
    constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export class DeleteReport implements Action {
    readonly type = ReportActionTypes.DeleteReport;
    constructor(public payload: any) { }
}

export class DeleteReportSuccess implements Action {
    readonly type = ReportActionTypes.DeleteReportSuccess;
    constructor(public payload: any) { }
}

export class DeleteReportFail implements Action {
    readonly type = ReportActionTypes.DeleteReportFail;
    constructor(public payload: HttpErrorResponse | { message: string }) { }
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


