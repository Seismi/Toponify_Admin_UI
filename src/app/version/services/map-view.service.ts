import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapViewApiResponse } from '../store/models/mapview.model';

@Injectable()
export class MapViewService {

  constructor(private http: HttpClient) { }

  getMapView(versionId: string, modelLinkId: string): Observable<MapViewApiResponse> {
    return this.http.get<MapViewApiResponse>(`/${versionId}/model/mapView/${modelLinkId}`);
  }

}
