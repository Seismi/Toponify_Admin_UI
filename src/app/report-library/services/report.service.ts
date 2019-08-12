import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportLibraryApiResponse, ReportDetailApiRespoonse } from '../store/models/report.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface GetReportLibraryRequestQueryParams {
  workPackageQuery?: string[];
}

@Injectable()
export class ReportService {

  constructor(private http: HttpClient) { }

  getReports(queryParams?: GetReportLibraryRequestQueryParams): Observable<ReportLibraryApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<ReportLibraryApiResponse>(`/reports`, {params: params});
  }

  getReport(id: string, queryParams?: GetReportLibraryRequestQueryParams): Observable<ReportDetailApiRespoonse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<ReportDetailApiRespoonse>(`/reports/${id}`, {params: params});
  }

  addReport(workPackageId: string, request: any): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/reports`, request, httpOptions);
  }

  updateReport(workPackageId: string, reportId: string, request: any): Observable<any> {
    return this.http.put<any>(`/workpackages/${workPackageId}/reports/${reportId}`, request, httpOptions);
  }

  deleteReport(workPackageId: string, reportId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${workPackageId}/reports/${reportId}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    let httpParams = new HttpParams();
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          httpParams = httpParams.append(`${key}[]`, item);
        });
      } else {
        httpParams = httpParams.set(key, obj[key]);
      }
    });
    return httpParams;
  }
}