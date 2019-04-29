import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkPackgeListHttpParams {
  ownerQuery?: string;
  scopeQuery?: string;
  page?: string;
  size?: string;
}

@Injectable()
export class WorkPackageService {

  constructor(private http: HttpClient) { }

  getWorkPackageList(queryParams: WorkPackgeListHttpParams): Observable<any[]> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/workpackages`, {params: params});
  }

  getWorkPackage(id: string): Observable<any> {
    return this.http.get<any>(`/workpackages/${id}`);
  }

  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
