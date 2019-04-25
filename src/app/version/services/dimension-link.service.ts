import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DimensionLinkApiResponse, DimensionLinkApiRequest, DimensionLinkSingleApiResponse } from '../store/models/dimension-link.model';
import {DimensionApiRequest} from '@app/version/store/models/dimension.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DimensionLinkService {

  constructor(private http: HttpClient) { }

  getDimensionLinks(versionId: string): Observable<DimensionLinkApiResponse> {
    return this.http.get<DimensionLinkApiResponse>(`/${versionId}/dimension/link`);
  }

  addDimensionLink(dimensionLink: DimensionLinkApiRequest, versionId: string): Observable<DimensionLinkSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/dimension/link`, dimensionLink, httpOptions);
  }

  updateDimensionLink(dimensionLink: DimensionLinkApiRequest, versionId: string): Observable<DimensionLinkSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/dimension/link`, dimensionLink, httpOptions);
  }

  deleteDimensionLink(versionId: string, dimensionLinkId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/dimension/link/${dimensionLinkId}`);
  }

}
