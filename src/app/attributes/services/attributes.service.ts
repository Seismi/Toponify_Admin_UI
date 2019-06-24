import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttributeEntitiesHttpParams, AttributeEntitiesResponse } from '../store/models/attributes.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AttributeService {

  constructor(private http: HttpClient) { }

  getAttributeEntities(queryParams: AttributeEntitiesHttpParams): Observable<AttributeEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/attributes`, {params: params});
  }

  getAttribute(id: string): Observable<any> {
    return this.http.get<any>(`/attributes/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
      .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}