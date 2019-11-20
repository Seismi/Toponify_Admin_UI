import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NodesApiResponse, NodeDetailApiResponse } from '../store/models/node.model';
import { NodeLinksApiResponse, NodeLinkDetailApiResponse } from '../store/models/node-link.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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

  // getNode(id: string): Observable<NodeDetailApiResponse> {
  //   return this.http.get<NodeDetailApiResponse>(`/nodes/${id}`);
  // }

  getNodeLinks(): Observable<NodeLinksApiResponse> {
    return this.http.get<NodeLinksApiResponse>(`/nodelinks`);
  }

  getNodeLink(id: string): Observable<NodeLinkDetailApiResponse> {
    return this.http.get<NodeLinkDetailApiResponse>(`/nodelinks/${id}`);
  }

  getMapView(id: string): Observable<any> {
    return this.http.get<any>(`/nodelinks/${id}/components`);
  }

  getNodeUsageView(id: string): Observable<any> {
    return this.http.get<any>(`/nodes/${id}/usage`);
  }

  // FIXME: define missing types
  updateLayoutNodesLocation(layoutId: string, data: {id: string, locationCoordinates: string}): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodes/location`, {data: data}, httpOptions);
  }
  // FIXME: define missing types
  updateLayoutNodeLinksRoute(layoutId: string, data: {id: string, points: any[]}): Observable<any> {
    return this.http.put<any>(`/layouts/${layoutId}/nodelinks/route`, {data: data}, httpOptions);
  }
}
