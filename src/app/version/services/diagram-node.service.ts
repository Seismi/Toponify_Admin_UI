import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum NodeType {
  System = 'system',
  Model = 'model',
  Dimension = 'dimension',
  Element = 'element'
}

@Injectable()
export class DiagramNodeService {

  constructor(private http: HttpClient) { }

  // FIXME: systemId should be changed to nodeId
  getVersionDescendants(type: NodeType, versionId: string, nodeId: string): Observable<any> {
    return this.http.get<any>(`/${versionId}/${type}/${nodeId}/descendants`);
  }
}
