import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ReportDetailApiRespoonse,
  ReportLibraryApiResponse,
  ReportDetailApiRequest,
  ReportEntityApiRequest,
  ReportEntityApiResponse,
  ReportDataSet,
  ReportingConcept,
  Report
} from '../store/models/report.model';
import { toHttpParams } from '@app/services/utils';
import { Tag } from '@app/architecture/store/models/node.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface GetReportLibraryRequestQueryParams {
  workPackageQuery?: string[];
  scopeQuery?: string;
  format?: string;
}

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  getReports(queryParams?: GetReportLibraryRequestQueryParams): Observable<any> {
    const params = queryParams ? toHttpParams(queryParams) : new HttpParams();
    return this.http.get<any>(`/reports`, { 
      params: params,
      responseType: queryParams && queryParams.format ? ('text' as 'json') : 'json'
    });
  }

  getReport(id: string, queryParams?: GetReportLibraryRequestQueryParams): Observable<ReportDetailApiRespoonse> {
    const params = toHttpParams(queryParams);
    return this.http.get<ReportDetailApiRespoonse>(`/reports/${id}`, { params: params });
  }

  addReport(workPackageId: string, request: ReportDetailApiRequest): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports`, request, httpOptions);
  }

  updateReport(
    workPackageId: string,
    reportId: string,
    request: ReportEntityApiRequest
  ): Observable<ReportEntityApiResponse> {
    return this.http.put<ReportEntityApiResponse>(
      `/workpackages/${workPackageId}/reports/${reportId}`,
      request,
      httpOptions
    );
  }

  deleteReport(workPackageId: string, reportId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${workPackageId}/reports/${reportId}/deleteRequest`,
      {}
    );
  }

  addOwner(workPackageId: string, reportId: string, ownerId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${workPackageId}/reports/${reportId}/owners/${ownerId}`,
      {}
    );
  }

  deleteOwner(workPackageId: string, reportId: string, ownerId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${workPackageId}/reports/${reportId}/owners/${ownerId}/deleteRequest`,
      {}
    );
  }

  getDataSets(workPackageId: string, reportId: string): Observable<{ data: ReportDataSet[] }> {
    return this.http.get<{ data: ReportDataSet[] }>(`/workpackages/${workPackageId}/reports/${reportId}/dataNodes`);
  }

  addDataSets(workPackageId: string, reportId: string, ids: { id: string }[]): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/dataNodes`, {
      data: ids
    });
  }

  removeDataSet(workPackageId: string, reportId: string, datasetId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${workPackageId}/reports/${reportId}/dataSets/${datasetId}/deleteRequest`,
      {}
    );
  }

  updateDimensionFilter(workPackageId: string, reportId: string, dimensionId: string, filter: string) {
    return this.http.put(`/workpackages/${workPackageId}/reports/${reportId}/dimensionOverrides/${dimensionId}`, {
      data: {
        sort: 0,
        filter
      }
    });
  }

  getReportingConcepts(
    wpid: string,
    radioId: string,
    dimensionId: string
  ): Observable<{ data: { selected: ReportingConcept[]; available: ReportingConcept[] } }> {
    return this.http.get<{ data: { selected: ReportingConcept[]; available: ReportingConcept[] } }>(
      `/workpackages/${wpid}/reports/${radioId}/dimensions/${dimensionId}/conceptSelections`
    );
  }

  addReportingConcepts(
    wpid: string,
    reportId: string,
    dimensionId: string,
    conceptIds: { id: string }[]
  ): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${wpid}/reports/${reportId}/dimensions/${dimensionId}/conceptSelections`,
      { data: conceptIds }
    );
  }

  deleteReportingConcept(
    wpid: string,
    reportId: string,
    dimensionId: string,
    conceptId: string
  ): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${wpid}/reports/${reportId}/dimensions/${dimensionId}/conceptSelections/${conceptId}/deleteRequest`,
      {}
    );
  }

  updateCustomProperty(
    workPackageId: string, 
    reportId: string, 
    customPropertyId: string, 
    data: string
  ): Observable<Object> {
    return this.http.put(
      `/workpackages/${workPackageId}/reports/${reportId}/customPropertyValues/${customPropertyId}`, { data }, httpOptions
    );
  }

  deleteCustomProperty(
    workPackageId: string,
    reportId: string,
    customPropertyId: string,
  ): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(
      `/workpackages/${workPackageId}/reports/${reportId}/customPropertyValues/${customPropertyId}/deleteRequest`,
      {}
    );
  }

  getReportTags(workPackageId: string, reportId: string): Observable<{ data: Tag[] }> {
    return this.http.get<{ data: Tag[] }>(`/workpackages/${workPackageId}/reports/${reportId}/tags`);
  }

  addReportTags(workPackageId: string, reportId: string, tagIds: { id: string }[]): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/tags`, { data: tagIds });
  }

  deleteReportTags(workPackageId: string, reportId: string, tagId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/tags/${tagId}/deleteRequest`, {});
  }

  addReportRadio(workPackageId: string, reportId: string, radioId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/radios/${radioId}`, {});
  }

  deleteReportRadio(workPackageId: string, reportId: string, radioId: string) {
    return this.http.delete(`/workpackages/${workPackageId}/reports/${reportId}/radios/${radioId}`);
  }

}
