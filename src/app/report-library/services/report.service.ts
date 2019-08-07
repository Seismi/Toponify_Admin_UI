import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportLibraryApiResponse, ReportDetailApiRespoonse } from '../store/models/report.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ReportService {

  constructor(private http: HttpClient) { }

  getReports(): Observable<ReportLibraryApiResponse> {
    return this.http.get<ReportLibraryApiResponse>(`/reports`);
  }

  getReport(id: string): Observable<ReportDetailApiRespoonse> {
    return this.http.get<ReportDetailApiRespoonse>(`/reports/${id}`);
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

}