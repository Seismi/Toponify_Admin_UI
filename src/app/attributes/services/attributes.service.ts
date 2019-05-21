import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttributeApiResponse, AttributeApiRequest, AttributeSingleApiResponse, AddAttributeApiRequest } from '../store/models/attributes.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AttributeService {

  constructor(private http: HttpClient) { }

  getAttributes(): Observable<AttributeApiResponse> {
    return this.http.get<AttributeApiResponse>(`/attributes`);
  }

  addAttribute(attribute: AddAttributeApiRequest): Observable<AttributeSingleApiResponse> {
    return this.http.post<any>(`/attributes`, attribute, httpOptions);
  }

  updateAttribute(attribute: AttributeApiRequest): Observable<AttributeSingleApiResponse> {
    return this.http.put<any>(`/attributes`, attribute, httpOptions);
  }

  deleteAttribute(attributeId: string): Observable<any> {
    return this.http.delete<any>(`/attributes/${attributeId}`);
  }

}