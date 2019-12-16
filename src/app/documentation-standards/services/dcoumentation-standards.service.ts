import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentStandardApiRequest } from '../store/models/documentation-standards.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DocumentationStandardsService {

  constructor(private http: HttpClient) {}

  getCustomProperties(queryParams: any): Observable<any> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/customProperties`, { params: params });
  }

  getCustomProperty(id: string): Observable<any> {
    return this.http.get<any>(`/customProperties/${id}`);
  }

  addCustomProperty(entity: DocumentStandardApiRequest): Observable<any> {
    return this.http.post<any>(`/customProperties`, entity, httpOptions);
  }

  updateCustomeProperty(id: string, entity: DocumentStandardApiRequest): Observable<any> {
    return this.http.put<any>(`/customProperties/${id}`, entity, httpOptions);
  }

  deleteCustomPorperty(id: string): Observable<any> {
    return this.http.delete<any>(`/customProperties/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
