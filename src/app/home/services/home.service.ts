import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse
} from '@app/workpackage/store/models/workpackage.models';
import { RadioEntitiesHttpParams, RadioEntitiesResponse } from '@app/radio/store/models/radio.model';
import { GetLayoutEntitiesApiResponse, LayoutEntitiesHttpParams } from '@app/layout/store/models/layout.model';
import { UserApiResponse, Favourites } from '@app/settings/store/models/user.model';
import { toHttpParams } from '@app/services/utils';

@Injectable()
export class HomePageService {
  constructor(public http: HttpClient) {}

  getMyWorkPackages(queryParams: WorkPackageEntitiesHttpParams): Observable<WorkPackageEntitiesResponse> {
    const params = toHttpParams(queryParams);
    return this.http.get<WorkPackageEntitiesResponse>(`/navigate/myworkpackages`, { params: params });
  }

  getMyRadios(queryParams: RadioEntitiesHttpParams): Observable<RadioEntitiesResponse> {
    const params = toHttpParams(queryParams);
    return this.http.get<RadioEntitiesResponse>(`/navigate/myradios`, { params: params });
  }

  getMyProfile(): Observable<UserApiResponse> {
    return this.http.get<UserApiResponse>(`/navigate/myprofile`);
  }

  getMyFavourites(): Observable<{ data: Favourites[] }> {
    return this.http.get<{ data: Favourites[] }>(`/navigate/myfavourites`);
  }
}
