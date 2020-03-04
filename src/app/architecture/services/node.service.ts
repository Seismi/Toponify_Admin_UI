import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NodeDetail, NodeDetailApiResponse, NodeReportsApiResponse, Tag } from '../store/models/node.model';
import { NodeLinkDetail, NodeLinkDetailApiResponse } from '../store/models/node-link.model';
import {UpdateDiagramLayoutApiRequest} from '@app/architecture/store/models/layout.model';

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

@Injectable({ providedIn: 'root' })
export class NodeService {
  constructor(private http: HttpClient) {}

  getNodes(queryParams?: GetNodesRequestQueryParams): Observable<any> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get(`/nodes`, {
      params: params,
      responseType: queryParams && queryParams.format ? ('text' as 'json') : 'json'
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
      responseType: queryParams.format ? ('text' as 'json') : 'json'
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

  getReports(nodeId: string, queryParams?: GetNodesRequestQueryParams): Observable<NodeReportsApiResponse> {
    const params = queryParams ? this.toHttpParams(queryParams) : new HttpParams();
    return this.http.get<NodeReportsApiResponse>(`/nodes/${nodeId}/reports`, { params: params });
  }

  getNodeAvailableTags(workpackageId: string, linkId: string): Observable<{ data: Tag[] }> {
    return this.http.get<{ data: Tag[] }>(`/workpackages/${workpackageId}/nodes/${linkId}/tags`);
  }

  getLinkAvailableTags(workpackageId: string, linkId: string): Observable<{ data: Tag[] }> {
    return this.http.get<{ data: Tag[] }>(`/workpackages/${workpackageId}/nodelinks/${linkId}/tags`);
  }

  createTag(tag: Tag): Observable<{ data: Tag }> {
    const { id, ...tagData } = tag;
    return this.http.post<{ data: Tag }>(`/tags`, { data: tagData });
  }

  associateTagToNode(
    workpackageId: string,
    nodeId: string,
    tagIds: { id: string }[]
  ): Observable<{ data: NodeDetail }> {
    return this.http.post<{ data: NodeDetail }>(`/workpackages/${workpackageId}/nodes/${nodeId}/tags`, {
      data: tagIds
    });
  }

  associateTagToLink(
    workpackageId: string,
    linkId: string,
    tagIds: { id: string }[]
  ): Observable<{ data: NodeLinkDetail }> {
    return this.http.post<{ data: NodeLinkDetail }>(`/workpackages/${workpackageId}/nodelinks/${linkId}/tags`, {
      data: tagIds
    });
  }

  dissociateTagFromNode(workpackageId: string, nodeId: string, tagId: string): Observable<{ data: NodeDetail }> {
    return this.http.post<{ data: NodeDetail }>(
      `/workpackages/${workpackageId}/nodes/${nodeId}/tags/${tagId}/deleteRequest`,
      {}
    );
  }

  dissociateTagFromLink(workpackageId: string, linkId: string, tagId: string): Observable<{ data: NodeLinkDetail }> {
    return this.http.post<{ data: NodeLinkDetail }>(
      `/workpackages/${workpackageId}/nodelinks/${linkId}/tags/${tagId}/deleteRequest`,
      {}
    );
  }

  loadTags(): Observable<{ data: Tag[] }> {
    return this.http.get<{ data: Tag[] }>(`/tags`);
  }

  deleteTag(tagId: string): Observable<{}> {
    return this.http.delete(`/tags/${tagId}`);
  }

  updateTag(tag: Tag): Observable<{ data: Tag }> {
    return this.http.put<{ data: Tag }>(`/tags/${tag.id}`, { data: tag });
  }

  // FIXME: define missing types
  updateLayoutNodesLocation(layoutId: string, data: { id: string; locationCoordinates: string }): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/location`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  updateNodeExpandedState(layoutId: string, data: any): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/expandState`, { data: data }, httpOptions);
  }
  // FIXME: define missing types
  UpdateGroupAreaSize(layoutId: string, data: any): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/groupAreaSize`, { data: data }, httpOptions);
  }
  updateLayoutNodeLinksRoute(layoutId: string, data: { id: string; points: any[] }): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodelinks/route`, { data: data }, httpOptions);
  }

  updatePartsLayout(layoutId: string, data: UpdateDiagramLayoutApiRequest['data']): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/positionDetails`, { data: data}, httpOptions);
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
