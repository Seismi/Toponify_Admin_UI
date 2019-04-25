import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElementLinkApiResponse, ElementLinkApiRequest, ElementLinkSingleApiResponse } from '../store/models/element-link.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ElementLinkService {

  constructor(private http: HttpClient) { }

  getElementLinks(versionId: string): Observable<ElementLinkApiResponse> {
    return this.http.get<ElementLinkApiResponse>(`/${versionId}/element/link`);
  }

  addElementLink(element: ElementLinkApiRequest, versionId: string): Observable<ElementLinkSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/element/link`, element, httpOptions);
  }

  updateElementLink(element: ElementLinkApiRequest, versionId: string): Observable<ElementLinkSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/element/link`, element, httpOptions);
  }

  deleteElementLink(versionId: string, elementLinkId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/element/link/${elementLinkId}`);
  }

}
