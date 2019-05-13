import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RadioApiResponse } from '../store/models/radio.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RadioService {

  constructor(private http: HttpClient) { }

  getRadio(): Observable<RadioApiResponse> {
    return this.http.get<RadioApiResponse>(`/radio`);
  }

  getReplyRadio(): Observable<any> {
    return this.http.get<any>(`/radio`);
  }

  addRadio(request: any): Observable<any> {
    return this.http.post<any>(`/radio`, request, httpOptions);
  }

  addReplyRadio(request: any): Observable<any> {
    return this.http.post<any>(`/radio`, request, httpOptions);
  }

  archiveRadio(request: any): Observable<any> {
    return this.http.post<any>(`/radio`, request, httpOptions);
  }

}