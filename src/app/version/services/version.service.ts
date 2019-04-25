import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  VersionApiResponse,
  AddVersionApiRequest,
  AddVersionApiResponse,
  UpdateVersionApiRequest,
  UpdateVersionApiResponse
} from '../store/models/version.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VersionService {

  constructor(private http: HttpClient) { }

  getVersions(): Observable<VersionApiResponse> {
    return this.http.get<VersionApiResponse>(`/version`);
  }

  getVersion(id: string): Observable<any> {
    return this.http.get<any>(`/version/${id}`);
  }

  addVersion(request: AddVersionApiRequest): Observable<AddVersionApiResponse> {
    return this.http.post<any>('/version', request, httpOptions);
  }

  updateVersion(version: UpdateVersionApiRequest): Observable<UpdateVersionApiResponse> {
    return this.http.put<any>('/version/', version, httpOptions);
  }

  deleteVersion(id: string) {
    return this.http.delete(`/version/${id}`, httpOptions);
  }

  isUpdatedByExternalParty(id: string, request: any): Observable<any> {
    return this.http.post<any>(`/version/${id}/reloadRequired`, request, httpOptions);
  }

}
