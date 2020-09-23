import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Report,
  ReportLibraryApiResponse,
  ReportDetailApiRequest,
  ReportEntityApiRequest,
  ReportEntityApiResponse,
  ReportDetailApiRespoonse,
  DataNodes
} from '../models/report.model';
import { GetReportLibraryRequestQueryParams } from '@app/report-library/services/report.service';
import { Tag } from '@app/architecture/store/models/node.model';

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

  LoadDataNodes = '[Report] Load Data Nodes',
  LoadDataNodesSuccess = '[Report] Load Data Nodes Success',
  LoadDataNodesFail = '[Report] Load Data Nodes Fail',

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
  AddReportingConceptsFail = '[Report]  Add Reporting Concepts Fail',

  UpdateReportProperty = '[Report] Update Report Property',
  UpdateReportPropertySuccess = '[Report] Update Report Property Success',
  UpdateReportPropertyFailure = '[Report] Update Report Property Failure',

  DeleteReportProperty = '[Report] Delete Report Property',
  DeleteReportPropertySuccess = '[Report] Delete Report Property Success',
  DeleteReportPropertyFailure = '[Report] Delete Report Property Failure',

  LoadReportTags = '[Report] Load Report Tags',
  LoadReportTagsSuccess = '[Report] Load Report Tags Success',
  LoadReportTagsFail = '[Report] Load Report Tags Fail',

  AddReportTags = '[Report] Add Report Tags',
  AddReportTagsSuccess = '[Report] Add Report Tags Success',
  AddReportTagsFail = '[Report] Add Report Tags Fail',

  DeleteReportTags = '[Report] Delete Report Tags',
  DeleteReportTagsSuccess = '[Report] Delete Report Tags Success',
  DeleteReportTagsFail = '[Report] Delete Report Tags Fail',

  AddReportRadio = '[Report] Add Report Radio',
  AddReportRadioSuccess = '[Report] Add Report Radio Success',
  AddReportRadioFailure = '[Report] Add Report Radio Failure',

  DeleteReportRadio = '[Report] Delete Report Radio',
  DeleteReportRadioSuccess = '[Report] Delete Report Radio Success',
  DeleteReportRadioFailure = '[Report] Delete Report Radio Failure'
}

export class LoadReports implements Action {
  readonly type = ReportActionTypes.LoadReports;
  constructor(public payload?: GetReportLibraryRequestQueryParams) {}
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

export class UpdateReportProperty implements Action {
  readonly type = ReportActionTypes.UpdateReportProperty;
  constructor(public payload: { workPackageId: string; reportId: string; customPropertyId: string, data: string }) {}
}

export class UpdateReportPropertySuccess implements Action {
  readonly type = ReportActionTypes.UpdateReportPropertySuccess;
  constructor(public payload: Report) {}
}

export class UpdateReportPropertyFailure implements Action {
  readonly type = ReportActionTypes.UpdateReportPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteReportProperty implements Action {
  readonly type = ReportActionTypes.DeleteReportProperty;
  constructor(public payload: { workPackageId: string; reportId: string; customPropertyId: string }) {}
}

export class DeleteReportPropertySuccess implements Action {
  readonly type = ReportActionTypes.DeleteReportPropertySuccess;
  constructor(public payload: Report) {}
}

export class DeleteReportPropertyFailure implements Action {
  readonly type = ReportActionTypes.DeleteReportPropertyFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadReportTags implements Action {
  readonly type = ReportActionTypes.LoadReportTags;
  constructor(public payload: { workPackageId: string, reportId: string }) {}
}

export class LoadReportTagsSuccess implements Action {
  readonly type = ReportActionTypes.LoadReportTagsSuccess;
  constructor(public payload: Tag[]) {}
}

export class LoadReportTagsFail implements Action {
  readonly type = ReportActionTypes.LoadReportTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddReportTags implements Action {
  readonly type = ReportActionTypes.AddReportTags;
  constructor(public payload: { workPackageId: string; reportId: string, tagIds: { id: string }[] }) {}
}

export class AddReportTagsSuccess implements Action {
  readonly type = ReportActionTypes.AddReportTagsSuccess;
  constructor(public payload: Report) {}
}

export class AddReportTagsFail implements Action {
  readonly type = ReportActionTypes.AddReportTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteReportTags implements Action {
  readonly type = ReportActionTypes.DeleteReportTags;
  constructor(public payload: { workPackageId: string; reportId: string, tagId: string }) {}
}

export class DeleteReportTagsSuccess implements Action {
  readonly type = ReportActionTypes.DeleteReportTagsSuccess;
  constructor(public payload: Report) {}
}

export class DeleteReportTagsFail implements Action {
  readonly type = ReportActionTypes.DeleteReportTagsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddReportRadio implements Action {
  readonly type = ReportActionTypes.AddReportRadio;
  constructor(public payload: { workPackageId: string; reportId: string, radioId: string }) {}
}

export class AddReportRadioSuccess implements Action {
  readonly type = ReportActionTypes.AddReportRadioSuccess;
  constructor(public payload: Report) {}
}

export class AddReportRadioFailure implements Action {
  readonly type = ReportActionTypes.AddReportRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteReportRadio implements Action {
  readonly type = ReportActionTypes.DeleteReportRadio;
  constructor(public payload: { workPackageId: string; reportId: string; radioId: string }) {}
}

export class DeleteReportRadioSuccess implements Action {
  readonly type = ReportActionTypes.DeleteReportRadioSuccess;
  constructor(public payload: Report) {}
}

export class DeleteReportRadioFailure implements Action {
  readonly type = ReportActionTypes.DeleteReportRadioFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadDataNodes implements Action {
  readonly type = ReportActionTypes.LoadDataNodes;
  constructor(public payload: { workPackageId: string; reportId: string; }) {}
}

export class LoadDataNodesSuccess implements Action {
  readonly type = ReportActionTypes.LoadDataNodesSuccess;
  constructor(public payload: DataNodes[]) {}
}

export class LoadDataNodesFail implements Action {
  readonly type = ReportActionTypes.LoadDataNodesFail;
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
  | AddReportingConceptsFail
  | UpdateReportProperty
  | UpdateReportPropertySuccess
  | UpdateReportPropertyFailure
  | DeleteReportProperty
  | DeleteReportPropertySuccess
  | DeleteReportPropertyFailure
  | LoadReportTags
  | LoadReportTagsSuccess
  | LoadReportTagsFail
  | AddReportTags
  | AddReportTagsSuccess
  | AddReportTagsFail
  | DeleteReportTags
  | DeleteReportTagsSuccess
  | DeleteReportTagsFail
  | AddReportRadio
  | AddReportRadioSuccess
  | AddReportRadioFailure
  | DeleteReportRadio
  | DeleteReportRadioSuccess
  | DeleteReportRadioFailure
  | LoadDataNodes
  | LoadDataNodesSuccess
  | LoadDataNodesFail;
