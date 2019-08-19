import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntitiesHttpParams, RadioEntitiesResponse } from '@app/radio/store/models/radio.model';
import { LayoutEntitiesHttpParams, GetLayoutEntitiesApiResponse } from '@app/layout/store/models/layout.model';

@Injectable()
export class HomePageService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(public http: HttpClient) { }

  getMyWorkPackages(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/navigate/myworkpackages`, {params: params});
  }

  getMyRadios(queryParams: RadioEntitiesHttpParams): Observable<RadioEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/navigate/myradios`, {params: params});
  }

  getMyLayouts(queryParams: LayoutEntitiesHttpParams): Observable<GetLayoutEntitiesApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/navigate/mylayouts`, {params: params});
  }

  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }

}