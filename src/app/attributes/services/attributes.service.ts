import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttributeEntitiesHttpParams, AttributeEntitiesResponse } from '../store/models/attributes.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface GetAttributeRequestQueryParams {
  workPackageQuery?: string[];
}

@Injectable()
export class AttributeService {

  constructor(private http: HttpClient) { }

  getAttributeEntities(queryParams?: GetAttributeRequestQueryParams): Observable<AttributeEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/attributes`, {params: params});
  }

  getAttribute(id: string, queryParams?: GetAttributeRequestQueryParams): Observable<any> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/attributes/${id}`, {params: params});
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