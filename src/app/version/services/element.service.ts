import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElementApiResponse, ElementApiRequest, ElementSingleApiResponse } from '../store/models/element.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ElementService {

  constructor(private http: HttpClient) { }

  getElements(versionId: string): Observable<ElementApiResponse> {
    return this.http.get<ElementApiResponse>(`/${versionId}/element`);
  }

  addElement(element: ElementApiRequest, versionId: string): Observable<ElementApiRequest> {
    return this.http.post<any>(`/${versionId}/element`, element, httpOptions);
  }

  updateElement(element: ElementApiRequest, versionId: string): Observable<ElementSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/element`, element, httpOptions);
  }

  deleteElement(versionId: string, elementId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/element/${elementId}`);
  }

}
