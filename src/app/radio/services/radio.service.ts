import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RadioEntitiesHttpParams, RadioEntitiesResponse, RadioApiRequest, ReplyApiRequest, RadioDetailApiResponse } from '../store/models/radio.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RadioService {

  constructor(private http: HttpClient) { }

  getRadioEntities(queryParams: RadioEntitiesHttpParams): Observable<RadioEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/radios`, {params: params});
  }

  getRadio(id: string): Observable<any> {
    return this.http.get<any>(`/radios/${id}`);
  }

  addRadioEntity(entity: RadioApiRequest): Observable<any> {
    return this.http.post<any>(`/radios`, entity, httpOptions);
  }

  addRadioReply(entity: ReplyApiRequest, id: string): Observable<any> {
    return this.http.post<any>(`/radios/${id}/reply`, entity, httpOptions);
  }

  updateRadioProperty(radioId: string, customPropertyId: string, data: any): Observable<RadioDetailApiResponse> {
    return this.http.put<RadioDetailApiResponse>(`/radios/${radioId}/customPropertyvalues/${customPropertyId}`, data, httpOptions);
  }

  deleteRadioProperty(radioId: string, customPropertyId: string): Observable<RadioDetailApiResponse> {
    return this.http.delete<RadioDetailApiResponse>(`/radios/${radioId}/customPropertyValues/${customPropertyId}`)
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
      .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}