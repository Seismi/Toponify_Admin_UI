import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NodesApiResponse, NodeDetailApiResponse } from '../store/models/node.model';
import { NodeLinksApiResponse, NodeLinkDetailApiResponse } from '../store/models/node-link.model';

export enum NodeType {
  system = 'system',
  dataSet = 'data set',
  dimension = 'dimension',
  reportingConcept = 'reporting concept'
}

export enum LinkType {
  system = 'system',
  model = 'model'
}

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
    return this.http.get<NodeLinksApiResponse>(`/nodelinks`);
  }

  getNodeLink(id: string): Observable<NodeLinkDetailApiResponse> {
    return this.http.get<NodeLinkDetailApiResponse>(`/nodelinks/${id}`);
  }

}
