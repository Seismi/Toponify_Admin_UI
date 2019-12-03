import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AttributeEntitiesResponse,
  AttributeApiResponse,
  AttributeDetailApiResponse,
  AttributeApiRequest,
  AttributeDetailApiRequest,
  CustomPropertyValues,
  CustomPropertiesApiRequest
} from '../store/models/attributes.model';
import { OwnersEntityOrApproversEntity } from '@app/workpackage/store/models/workpackage.models';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface GetAttributeRequestQueryParams {
  workPackageQuery?: string[];
  scopeQuery?: string;
}

@Injectable()
export class AttributeService {
  constructor(private http: HttpClient) {}

  getAttributeEntities(queryParams?: GetAttributeRequestQueryParams): Observable<AttributeEntitiesResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/attributes`, { params: params });
  }

  getAttribute(id: string, queryParams?: GetAttributeRequestQueryParams): Observable<any> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<any>(`/attributes/${id}`, { params: params });
  }

  addAttribute(workPackageId: string, entity: AttributeApiRequest): Observable<AttributeApiResponse> {
    return this.http.post<AttributeApiResponse>(`/workpackages/${workPackageId}/attributes`, entity, httpOptions);
  }

  updateAttribute(
    workPackageId: string,
    attributeId: string,
    entity: AttributeDetailApiRequest
  ): Observable<AttributeDetailApiResponse> {
    return this.http.put<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}`,
      entity,
      httpOptions
    );
  }

  deleteAttribute(workPackageId: string, attributeId: string): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/deleteRequest`,
      {}
    );
  }

  addOwner(
    workPackageId: string,
    attributeId: string,
    ownerId: string,
    entity: OwnersEntityOrApproversEntity
  ): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/owners/${ownerId}`,
      entity,
      httpOptions
    );
  }

  deleteOwner(workPackageId: string, attributeId: string, ownerId: string): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/owners/${ownerId}/deleteRequest`,
      {}
    );
  }

  updateProperty(
    workPackageId: string,
    attributeId: string,
    customPropertyId: string,
    entity: CustomPropertiesApiRequest
  ): Observable<AttributeDetailApiResponse> {
    return this.http.put<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/customPropertyValues/${customPropertyId}`,
      entity,
      httpOptions
    );
  }

  deleteProperty(
    workPackageId: string,
    attributeId: string,
    customPropertyId: string
  ): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/customPropertyValues/${customPropertyId}/deleteRequest`,
      {}
    );
  }

  addRelated(
    workPackageId: string,
    attributeId: string,
    relatedAttributeId: string
  ): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/related/${relatedAttributeId}`,
      httpOptions
    );
  }

  deleteRelated(
    workPackageId: string,
    attributeId: string,
    relatedAttributeId: string
  ): Observable<AttributeDetailApiResponse> {
    return this.http.post<AttributeDetailApiResponse>(
      `/workpackages/${workPackageId}/attributes/${attributeId}/related/${relatedAttributeId}/deleteRequest`,
      {}
    );
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
