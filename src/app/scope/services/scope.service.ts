import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ScopeEntitiesHttpParams,
  GetScopeEntitiesApiResponse,
  GetScopeApiResponse,
  ScopeDetails,
  AddScopeApiResponse,
  UpdateScopeApiResponse
} from '../store/models/scope.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ScopeService {
  constructor(private http: HttpClient) {}

  getScopes(queryParams: ScopeEntitiesHttpParams): Observable<GetScopeEntitiesApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<GetScopeEntitiesApiResponse>(`/scopes`, { params: params });
  }

  getScope(id: string): Observable<GetScopeApiResponse> {
    return this.http.get<GetScopeApiResponse>(`/scopes/${id}`);
  }

  addScope(data: ScopeDetails): Observable<AddScopeApiResponse> {
    return this.http.post<AddScopeApiResponse>(`/scopes`, { data: data }, httpOptions);
  }

  updateScope(id: string, data: ScopeDetails): Observable<UpdateScopeApiResponse> {
    return this.http.put<UpdateScopeApiResponse>(`/scopes/${id}`, { data: data }, httpOptions);
  }

  deleteScope(id: string): Observable<any> {
    return this.http.delete<any>(`/scopes/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
