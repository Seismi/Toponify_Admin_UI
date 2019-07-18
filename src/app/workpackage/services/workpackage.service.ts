import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkPackageEntitiesHttpParams, WorkPackageApiRequest, WorkPackageEntitiesResponse, WorkPackageApiResponse, OwnersEntityOrApproversEntity } from '../store/models/workpackage.models';
import 'rxjs/add/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class WorkPackageService {

  constructor(private http: HttpClient) { }

  getWorkPackageEntities(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/workpackages`, {params: params});
  }

  getWorkPackage(id: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${id}`);
  }

  addWorkPackageEntity(entity: WorkPackageApiRequest): Observable<any> {
    return this.http.post<any>(`/workpackages`, entity, httpOptions);
  }

  updateWorkPackageEntity(workPackage: WorkPackageApiResponse, id: string, ): Observable<any> {
    return this.http.put<any>(`/workpackages/${id}`, workPackage, httpOptions);
  }

  deleteWorkPackageEntity(entityId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${entityId}`);
  }

  addOwner(entity: OwnersEntityOrApproversEntity, workPackageId: string, ownerId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/owners/${ownerId}`, entity, httpOptions);
  }

  deleteOwner(workPackageId: string, ownerId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${workPackageId}/owners/${ownerId}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
