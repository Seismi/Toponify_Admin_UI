import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkPackageEntitiesHttpParams, WorkPackageApiRequest,
  WorkPackageEntitiesResponse } from '../store/models/workpackage.models';
import 'rxjs/add/observable/of';

@Injectable()
export class WorkPackageService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(public http: HttpClient) { }

  getWorkPackageEntities(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/workpackages`, {params: params});
  }

  getWorkPackage(id: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${id}`);
  }

  addWorkPackageEntity(entity: WorkPackageApiRequest): Observable<any> {
    return this.http.post<any>(`/workpackages`, entity, this.httpOptions);
  }

  updateWorkPackageEntity(entityId: string, entity: WorkPackageApiRequest): Observable<any> {
    return this.http.put<any>(`/workpackages/${entityId}`, entity, this.httpOptions);
  }

  deleteWorkPackageEntity(entityId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${entityId}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
