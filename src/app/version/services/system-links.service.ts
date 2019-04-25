import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemLinkApiResponse, SystemLinkApiRequest, AddSystemLinkApiResponse } from '../store/models/system-links.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SystemLinkService {

  constructor(private http: HttpClient) { }

  getSystemLinks(versionId: string): Observable<SystemLinkApiResponse> {
    return this.http.get<SystemLinkApiResponse>(`/${versionId}/system/link`);
  }

  addSystemLink(systemLink: SystemLinkApiRequest, versionId: string, ): Observable<AddSystemLinkApiResponse> {
    return this.http.post<AddSystemLinkApiResponse>(`/${versionId}/system/link`, systemLink, httpOptions);
  }

  updateSystemLink(systemLink: SystemLinkApiRequest, versionId: string): Observable<AddSystemLinkApiResponse> {
    return this.http.put<AddSystemLinkApiResponse>(`/${versionId}/system/link`, systemLink, httpOptions);
  }

  deleteSystemLink(versionId: string, systemLinkId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/system/link/${systemLinkId}`);
  }

}
