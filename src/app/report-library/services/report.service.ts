import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDetailApiRespoonse, ReportLibraryApiResponse, ReportDetailApiRequest, ReportEntityApiRequest, ReportEntityApiResponse } from '../store/models/report.model';
import { toHttpParams } from '@app/services/utils';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface GetReportLibraryRequestQueryParams {
  workPackageQuery?: string[];
  scopeQuery?: string;
}

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  getReports(queryParams?: GetReportLibraryRequestQueryParams): Observable<ReportLibraryApiResponse> {
    const params = toHttpParams(queryParams);
    return this.http.get<ReportLibraryApiResponse>(`/reports`, { params: params });
  }

  getReport(id: string, queryParams?: GetReportLibraryRequestQueryParams): Observable<ReportDetailApiRespoonse> {
    const params = toHttpParams(queryParams);
    return this.http.get<ReportDetailApiRespoonse>(`/reports/${id}`, { params: params });
  }

  addReport(workPackageId: string, request: ReportDetailApiRequest): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports`, request, httpOptions);
  }

  updateReport(workPackageId: string, reportId: string, request: ReportEntityApiRequest): Observable<ReportEntityApiResponse> {
    return this.http.put<ReportEntityApiResponse>(`/workpackages/${workPackageId}/reports/${reportId}`, request, httpOptions);
  }

  deleteReport(workPackageId: string, reportId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/deleteRequest`, {});
  }

  addOwner(workPackageId: string, reportId: string, ownerId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/owners/${ownerId}`, {});
  }

  deleteOwner(workPackageId: string, reportId: string, ownerId: string): Observable<ReportDetailApiRespoonse> {
    return this.http.post<ReportDetailApiRespoonse>(`/workpackages/${workPackageId}/reports/${reportId}/owners/${ownerId}/deleteRequest`, {});
  }
}
