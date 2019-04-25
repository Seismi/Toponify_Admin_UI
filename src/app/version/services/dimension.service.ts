import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DimensionApiResponse, DimensionApiRequest, DimensionSingleApiResponse } from '../store/models/dimension.model';
import {ModelApiRequest} from '@app/version/store/models/model-version.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DimensionService {

  constructor(private http: HttpClient) { }

  getModelDimensions(versionId: string): Observable<DimensionApiResponse> {
    return this.http.get<DimensionApiResponse>(`/${versionId}/dimension`);
  }

  addDimension(dimension: DimensionApiRequest, versionId: string): Observable<DimensionSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/dimension`, dimension, httpOptions);
  }

  updateDimension(dimension: DimensionApiRequest, versionId: string): Observable<DimensionSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/dimension`, dimension, httpOptions);
  }

  deleteDimension(versionId: string, dimensionId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/dimension/${dimensionId}`);
  }

}
