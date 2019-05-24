import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DocumentationStandardsService {

  constructor(private http: HttpClient) { }

  getCustomProperties(queryParams: any): Observable<any> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/customProperties`, {params: params});
  }

  getCustomProperty(id: string): Observable<any> {
    return this.http.get<any>(`/customProperties/${id}`);
  }

  addCustomProperty(data: any): Observable<any> {
    return this.http.post<any>(`/customProperties`, {data: data}, httpOptions);
  }

  updateCustomeProperty(id: string, data: any): Observable<any> {
    return this.http.put<any>(`/customProperties/${id}`, {data: data}, httpOptions);
  }
  

  deleteCustomPorperty(id: string): Observable<any> {
    return this.http.delete<any>(`/customProperties/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
