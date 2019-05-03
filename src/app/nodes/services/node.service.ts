import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NodesApiResponse, NodeDetailApiResponse } from '../store/models/node.model';
import { NodeLinksApiResponse, NodeLinkDetailApiResponse } from '../store/models/node-link.model';

@Injectable()
export class NodeService {

  constructor(private http: HttpClient) { }

  getNodes(): Observable<NodesApiResponse> {
    return this.http.get<NodesApiResponse>(`/nodes`);
  }

  getNode(id: string): Observable<NodeDetailApiResponse> {
    return this.http.get<NodeDetailApiResponse>(`/nodes/${id}`);
  }

  getNodeLinks(): Observable<NodeLinksApiResponse> {
    return this.http.get<NodeLinksApiResponse>(`/nodes/links`);
  }

  getNodeLink(id: string): Observable<NodeLinkDetailApiResponse> {
    return this.http.get<NodeLinkDetailApiResponse>(`/nodes/links/${id}`);
  }

}
