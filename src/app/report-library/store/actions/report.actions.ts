import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Report,
  ReportLibraryApiResponse,
  ReportDetailApiRequest,
  ReportEntityApiRequest,
  ReportEntityApiResponse,
  ReportDetailApiRespoonse
} from '../models/report.model';

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
  DeleteOwnerFail = '[Report] Delete Owner Fail',

  AddDataSetsToReport = '[Report] Add Data Sets To Report',
  AddDataSetsToReportSuccess = '[Report] Add Data Sets To Report Success',
  AddDataSetsToReportFail = '[Report] Add Data Sets To Report Fail',

  RemoveDataSetsFromReport = '[Report] Remove Data Set from Report',
  RemoveDataSetsFromReportSuccess = '[Report] Remove Data Sets From Report Success',
  RemoveDataSetsFromReportFail = '[Report] Remove Data Sets From Report Fail',

  SetDimensionFilter = '[Report] Set Dimension Filter',
  SetDimensionFilterSuccess = '[Report] Set Dimension Filter Success',
  SetDimensionFilterFail = '[Report] Set Dimension Filter Fail',

  DeleteReportingConcept = '[Report] Delete Reporting Concept',
  DeleteReportingConceptSuccess = '[Report] Delete Reporting Concept Success',
  DeleteReportingConceptFail = '[Report] Delete Reporting Concept Fail',

  AddReportingConcepts = '[Report] Add Reporting Concepts',
  AddReportingConceptsSuccess = '[Report] Add Reporting Concepts Success',
  AddReportingConceptsFail = '[Report]  Add Reporting Concepts Fail'
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
  constructor(public payload: { workPackageId: string; request: ReportDetailApiRequest }) {}
}

export class AddReportSuccess implements Action {
  readonly type = ReportActionTypes.AddReportSuccess;
  constructor(public payload: ReportDetailApiRespoonse) {}
}

export class AddReportFail implements Action {
  readonly type = ReportActionTypes.AddReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateReport implements Action {
  readonly type = ReportActionTypes.UpdateReport;
  constructor(public payload: { workPackageId: string; reportId: string; request: ReportEntityApiRequest }) {}
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
  constructor(public payload: { workPackageId: string; reportId: string }) {}
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
  constructor(public payload: { workPackageId: string; reportId: string; ownerId: string }) {}
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
  constructor(public payload: { workPackageId: string; reportId: string; ownerId: string }) {}
}

export class DeleteOwnerSuccess implements Action {
  readonly type = ReportActionTypes.DeleteOwnerSuccess;
  constructor(public payload: Report) {}
}

export class DeleteOwnerFail implements Action {
  readonly type = ReportActionTypes.DeleteOwnerFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddDataSetsToReport implements Action {
  readonly type = ReportActionTypes.AddDataSetsToReport;
  constructor(public payload: { workPackageId: string; reportId: string; ids: { id: string }[] }) {}
}

export class AddDataSetsToReportSuccess implements Action {
  readonly type = ReportActionTypes.AddDataSetsToReportSuccess;
  constructor(public payload: Report) {}
}

export class AddDataSetsToReportFail implements Action {
  readonly type = ReportActionTypes.AddDataSetsToReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class RemoveDataSetsFromReport implements Action {
  readonly type = ReportActionTypes.RemoveDataSetsFromReport;
  constructor(public payload: { workPackageId: string; reportId: string; dataSetId: string }) {}
}

export class RemoveDataSetsFromReportSuccess implements Action {
  readonly type = ReportActionTypes.RemoveDataSetsFromReportSuccess;
  constructor(public payload: Report) {}
}

export class RemoveDataSetsFromReportFail implements Action {
  readonly type = ReportActionTypes.RemoveDataSetsFromReportFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class SetDimensionFilter implements Action {
  readonly type = ReportActionTypes.SetDimensionFilter;
  constructor(public payload: { workPackageId: string; reportId: string; dimensionId: string; filter: string }) {}
}

export class SetDimensionFilterSuccess implements Action {
  readonly type = ReportActionTypes.SetDimensionFilterSuccess;
  constructor(public payload: Report) {}
}

export class SetDimensionFilterFail implements Action {
  readonly type = ReportActionTypes.SetDimensionFilterFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteReportingConcept implements Action {
  readonly type = ReportActionTypes.DeleteReportingConcept;
  constructor(public payload: { workPackageId: string; reportId: string; dimensionId: string; conceptId: string }) {}
}

export class DeleteReportingConceptSuccess implements Action {
  readonly type = ReportActionTypes.DeleteReportingConceptSuccess;
  constructor(public payload: Report) {}
}

export class DeleteReportingConceptFail implements Action {
  readonly type = ReportActionTypes.DeleteReportingConceptFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddReportingConcepts implements Action {
  readonly type = ReportActionTypes.AddReportingConcepts;
  constructor(
    public payload: { workPackageId: string; reportId: string; dimensionId: string; concepts: { id: string }[] }
  ) {}
}

export class AddReportingConceptsSuccess implements Action {
  readonly type = ReportActionTypes.AddReportingConceptsSuccess;
  constructor(public payload: Report) {}
}

export class AddReportingConceptsFail implements Action {
  readonly type = ReportActionTypes.AddReportingConceptsFail;
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
  | DeleteOwnerFail
  | AddDataSetsToReport
  | AddDataSetsToReportSuccess
  | AddDataSetsToReportFail
  | RemoveDataSetsFromReport
  | RemoveDataSetsFromReportSuccess
  | RemoveDataSetsFromReportFail
  | SetDimensionFilter
  | SetDimensionFilterSuccess
  | SetDimensionFilterFail
  | DeleteReportingConcept
  | DeleteReportingConceptSuccess
  | DeleteReportingConceptFail
  | AddReportingConcepts
  | AddReportingConceptsSuccess
  | AddReportingConceptsFail;
