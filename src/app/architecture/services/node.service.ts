import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomPropertyApiRequest, NodeDetailApiResponse, NodesApiResponse } from '../store/models/node.model';
import { NodeLinkDetailApiResponse, NodeLinksApiResponse } from '../store/models/node-link.model';

export interface GetNodesRequestQueryParams {
  layerQuery?: string;
  scopeQuery?: string;
  layoutQuery?: string;
  workPackageQuery: string[];
}

export interface GetLinksRequestQueryParams {
  layerQuery?: string;
  scopeQuery?: string;
  layoutQuery?: string;
  workPackageQuery?: string[];
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class NodeService {
  constructor(private http: HttpClient) {}

  getNodes(queryParams?: GetNodesRequestQueryParams): Observable<NodesApiResponse> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<NodesApiResponse>(`/nodes`, { params: params });
  }

  getNode(id: string, queryParams?: GetNodesRequestQueryParams): Observable<NodeDetailApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<NodeDetailApiResponse>(`/nodes/${id}`, {
      params: params
    });
  }

  getNodeLinks(queryParams?: GetLinksRequestQueryParams): Observable<NodeLinksApiResponse> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<NodeLinksApiResponse>(`/nodelinks`, {
      params: params
    });
  }

  getNodeLink(id: string, queryParams?: GetLinksRequestQueryParams): Observable<NodeLinkDetailApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<NodeLinkDetailApiResponse>(`/nodelinks/${id}`, {
      params: params
    });
  }

  getMapView(id: string, queryParams?: GetNodesRequestQueryParams): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<any>(`/nodelinks/${id}/components`, { params });
  }

  getNodeUsageView(id: string, queryParams?: { workPackageQuery: string[] }): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<any>(`/nodes/${id}/usage`, { params: params });
  }

  updateCustomPropertyValues(
    workPackageId: string,
    nodeId: string,
    customPropertyId: string,
    data: CustomPropertyApiRequest
  ): Observable<any> {
    return this.http.put<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}`,
      data,
      httpOptions
    );
  }

  deleteCustomPropertyValues(workPackageId: string, nodeId: string, customPropertyId: string): Observable<any> {
    return this.http.post<any>(`/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}/deleteRequest`, {});
  }

  // FIXME: define missing types
  updateLayoutNodesLocation(layoutId: string, data: { id: string; locationCoordinates: string }): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/location`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  updateLayoutNodeLinksRoute(layoutId: string, data: { id: string; points: any[] }): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodelinks/route`, { data: data }, httpOptions);
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
