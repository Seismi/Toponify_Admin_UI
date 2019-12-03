import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  OwnersEntityOrApproversEntity,
  WorkPackageApiRequest,
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse
} from '../store/models/workpackage.models';
import 'rxjs/add/observable/of';

@Injectable()
export class WorkPackageService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(public http: HttpClient) {}

  // FIXME: set type
  getWorkPackageAvailability(queryParams: any): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<any>(`/workpackages/selector/availability`, { params: params });
  }

  getWorkPackageEntities(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/workpackages`, { params: params });
  }

  getWorkPackage(id: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${id}`);
  }

  addWorkPackageEntity(entity: WorkPackageApiRequest): Observable<any> {
    return this.http.post<any>(`/workpackages`, entity, this.httpOptions);
  }

  updateWorkPackageEntity(entityId: string, workPackage: WorkPackageApiRequest): Observable<any> {
    return this.http.put<any>(`/workpackages/${entityId}`, workPackage, this.httpOptions);
  }

  deleteWorkPackageEntity(entityId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${entityId}`);
  }

  addOwner(entity: OwnersEntityOrApproversEntity, workPackageId: string, ownerId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/owners/${ownerId}`, entity, this.httpOptions);
  }

  deleteOwner(workPackageId: string, ownerId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${workPackageId}/owners/${ownerId}`);
  }

  addObjective(data: any, workPackageId: string, radioId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/objectives/${radioId}`, data, this.httpOptions);
  }

  deleteObjective(workPackageId: string, radioId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${workPackageId}/objectives/${radioId}`);
  }

  addRadio(data: any, workPackageId: string, radioId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/radios/${radioId}`, data, this.httpOptions);
  }

  deleteRadio(workPackageId: string, radioId: string): Observable<any> {
    return this.http.delete<any>(`/workpackages/${workPackageId}/radios/${radioId}`);
  }

  // TODO: move into sharable service

  Workpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/submit`, {});
  }
  /**
   *  Validate the user is a package owner. Validate the package status is 'draft'.
   *  Change the package status to 'submitted'. Create package approver records
   *  for each distinct owner of an object in the package.
   *  FIXME: missing return type
   */
  submitWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/submit`, {});
  }

  /**
   * Validate the user is a package approver. Validate the package status is 'submitted'.
   * Update the approval flag on the relevant package approver record. If the flag is set
   * for all approvers, change the package status to 'approved'.
   * FIXME: missing return type
   */
  approveWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/approve`, {});
  }

  /**
   * Validate the user is a package approver. Validate the package status is 'submitted'.
   * Delete all package approver records for this package. Change the package status to 'draft'.
   * FIXME: missing return type
   */
  rejectWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/reject`, {});
  }

  /**
   * Validate the user is a package owner. Validate the package status is 'approved'. Validate
   * that all baseline packages have a status of 'merged'. Change the package status to 'merging'.
   * Merge each pending change into the base architecture. Change the package status to 'merged'.
   * FIXME: missing return type
   */
  mergeWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/merge`, {});
  }

  /**
   * Validate the user is a package owner. Validate the package status is not 'draft',
   * 'merging' or 'merged'. Delete all package approver records for this package. Change the package status to 'draft'.
   * FIXME: missing return type
   */
  resetWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/reset`, {});
  }

  /**
   * Validate the user is a package owner. Validate the package status is not 'merging' or 'merged'.
   * Delete all package approver records for this package. Change the package status to 'superseded'.
   * FIXME: missing return type
   */
  supersedeWorkpackage(workPackageId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/supersede`, {});
  }

  // TODO: missing details POST /workpackages/{workPackageId}/objectives/{radioId}
  // TODO: missing details DELETE /workpackages/{workPackageId}/objectives/{radioId}
  // TODO: missing details POST /workpackages/{workPackageId}/owners/{ownerId}
  // TODO: missing details DELETE /workpackages/{workPackageId}/owners/{ownerId}
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
