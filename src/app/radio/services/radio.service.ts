import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import {
  RadioEntitiesHttpParams,
  RadioEntitiesResponse,
  RadioApiRequest,
  ReplyApiRequest,
  RadioDetailApiResponse,
  AdvancedSearchApiRequest
} from '../store/models/radio.model';
import { delay } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RadioService {
  constructor(private http: HttpClient) {}

  getRadioEntities(queryParams: RadioEntitiesHttpParams): Observable<RadioEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/radios`, { params: params });
  }

  getRadio(id: string): Observable<RadioDetailApiResponse> {
    return this.http.get<RadioDetailApiResponse>(`/radios/${id}`);
  }

  addRadioEntity(entity: RadioApiRequest): Observable<RadioDetailApiResponse> {
    return this.http.post<RadioDetailApiResponse>(`/radios`, entity, httpOptions).pipe(delay(500));
  }

  addRadioReply(entity: ReplyApiRequest, id: string): Observable<RadioEntitiesResponse> {
    return this.http.post<RadioEntitiesResponse>(`/radios/${id}/reply`, entity, httpOptions);
  }

  updateRadioProperty(radioId: string, customPropertyId: string, data: any): Observable<RadioDetailApiResponse> {
    return this.http.put<RadioDetailApiResponse>(
      `/radios/${radioId}/customPropertyvalues/${customPropertyId}`,
      data,
      httpOptions
    );
  }

  deleteRadioProperty(radioId: string, customPropertyId: string): Observable<RadioDetailApiResponse> {
    return this.http.delete<RadioDetailApiResponse>(`/radios/${radioId}/customPropertyValues/${customPropertyId}`);
  }

  searchRadio(data: AdvancedSearchApiRequest): Observable<RadioEntitiesResponse> {
    return this.http.post<RadioEntitiesResponse>(`/radios/advanced/search`, data, httpOptions);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
