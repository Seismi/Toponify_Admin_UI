import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchApiResponse } from '../store/models/search.models';

export interface SearchQueryParams {
  text?: string;
  tag?: string;
}

@Injectable()
export class SearchService {

  constructor(private http: HttpClient) { }

  getSearchResults(queryParams?: SearchQueryParams): Observable<SearchApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<SearchApiResponse>(`/find`, {params: params});
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    let httpParams = new HttpParams();
    Object.getOwnPropertyNames(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        obj[key].forEach(item => {
          httpParams = httpParams.append(`${key}[]`, item);
        });
      } else {
        httpParams = httpParams.set(key, obj[key]);
      }
    });
    return httpParams;
  }
}