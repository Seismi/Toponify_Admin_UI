import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CustomPropertyApiRequest,
  NodeDetailApiResponse,
  NodeExpandedStateApiRequest,
  NodesApiResponse,
  NodeReportsApiResponse
} from '../store/models/node.model';
import { NodeLinkDetailApiResponse, NodeLinksApiResponse } from '../store/models/node-link.model';

export interface GetNodesRequestQueryParams {
  layerQuery?: string;
  scopeQuery?: string;
  layoutQuery?: string;
  workPackageQuery: string[];
  format?: string;
}

export interface GetLinksRequestQueryParams {
  layerQuery?: string;
  scopeQuery?: string;
  layoutQuery?: string;
  workPackageQuery?: string[];
  format?: string;
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class NodeService {
  constructor(private http: HttpClient) {}

  getNodes(queryParams?: GetNodesRequestQueryParams): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get(`/nodes`, {
      params: params,
      responseType: queryParams.format ? 'text' as 'json' : 'json'
    });
  }

  getNode(id: string, queryParams?: GetNodesRequestQueryParams): Observable<NodeDetailApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<NodeDetailApiResponse>(`/nodes/${id}`, {
      params: params
    });
  }

  getNodeLinks(queryParams?: GetLinksRequestQueryParams): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get(`/nodelinks`, {
      params: params,
      responseType: queryParams.format ? 'text' as 'json' : 'json'
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
    return this.http.post<any>(
      `/workpackages/${workPackageId}/nodes/${nodeId}/customPropertyValues/${customPropertyId}/deleteRequest`,
      {}
    );
  }

  getReports(nodeId: string, queryParams?: GetNodesRequestQueryParams): Observable<NodeReportsApiResponse> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<NodeReportsApiResponse>(`/nodes/${nodeId}/reports`, { params: params });
  }

  // FIXME: define missing types
  updateLayoutNodesLocation(layoutId: string, data: { id: string; locationCoordinates: string }): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/location`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  updateNodeExpandedState(layoutId: string, data: NodeExpandedStateApiRequest): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/expandState`, { data: data }, httpOptions);
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
