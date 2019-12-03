import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddLayoutApiResponse,
  GetLayoutApiResponse,
  GetLayoutEntitiesApiResponse,
  LayoutDetails,
  LayoutEntitiesHttpParams,
  UpdateLayoutApiResponse
} from '../store/models/layout.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LayoutService {
  constructor(private http: HttpClient) {}

  getLayouts(queryParams: LayoutEntitiesHttpParams): Observable<GetLayoutEntitiesApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<GetLayoutEntitiesApiResponse>(`/layouts`, { params: params });
  }

  getLayout(id: string): Observable<GetLayoutApiResponse> {
    return this.http.get<GetLayoutApiResponse>(`/layouts/${id}`);
  }

  addLayout(data: LayoutDetails): Observable<AddLayoutApiResponse> {
    return this.http.post<AddLayoutApiResponse>(`/layouts`, { data: data }, httpOptions);
  }

  updateLayout(id: string, data: LayoutDetails): Observable<UpdateLayoutApiResponse> {
    return this.http.put<UpdateLayoutApiResponse>(`/layouts/${id}`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  updateLayoutNodesLocation(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/layouts/${id}/nodes/location`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  updateLayoutNodeLinksRoute(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/layouts/${id}/nodelinks/route`, { data: data }, httpOptions);
  }

  deleteLayout(id: string): Observable<any> {
    return this.http.delete<any>(`/layouts/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
