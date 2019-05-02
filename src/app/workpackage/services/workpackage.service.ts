import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkPackageEntitiesHttpParams, WorkPackageApiRequest, WorkPackageEntitiesResponse } from '../store/models/workpackage.models';
import 'rxjs/add/observable/of';
import workpackageEntities from '../../../mock/workpackage';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkPackageService {

  constructor(private http: HttpClient) { }

  getWorkPackageEntities(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return Observable.of(workpackageEntities);
    return this.http.get<any>(`/workpackages`, {params: params});
  }

  getWorkPackageEntity(entityId: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${entityId}`);
  }

  addWorkPackageEntity(entity: WorkPackageApiRequest): Observable<any> {
    return this.http.post<any>(`/workpackages`, entity, httpOptions);
  }

  updateWorkPackageEntity(entityId: string, entity: WorkPackageApiRequest): Observable<any> {
    return this.http.put<any>(`/workpackages/${entityId}`, entity, httpOptions);
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
