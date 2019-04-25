import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VersionSystemApiResponse, SystemApiRequest, SystemApiResponse, SystemSingleApiResponse } from '../store/models/system.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VersionSystemService {

  constructor(private http: HttpClient) { }

  getVersionSystems(versionId: string): Observable<VersionSystemApiResponse> {
    return this.http.get<VersionSystemApiResponse>(`/${versionId}/system`);
  }

  addVersionSystem(system: SystemApiRequest, versionId: string): Observable<SystemApiResponse> {
    return this.http.post<any>(`/${versionId}/system`, system, httpOptions);
  }

  updateVersionSystem(system: SystemApiRequest, versionId: string): Observable<SystemSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/system`, system, httpOptions);
  }

  deleteVersionSystems(versionId: string, systemId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/system/${systemId}`);
  }

}
