import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttributeApiResponse, AttributeApiRequest, AttributeSingleApiResponse, AddAttributeApiRequest } from '../store/models/attribute.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AttributeService {

  constructor(private http: HttpClient) { }

  getAttributes(versionId: string): Observable<AttributeApiResponse> {
    return this.http.get<AttributeApiResponse>(`/${versionId}/attribute`);
  }

  addAttribute(attribute: AddAttributeApiRequest, versionId: string): Observable<AttributeSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/attribute`, attribute, httpOptions);
  }

  updateAttribute(attribute: AttributeApiRequest, versionId: string): Observable<AttributeSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/attribute`, attribute, httpOptions);
  }

  deleteAttribute(versionId: string, attributeId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/attribute/${attributeId}`);
  }

}
