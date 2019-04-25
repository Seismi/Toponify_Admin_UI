import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum LinkType {
  System = 'system',
  Model = 'model'
}
@Injectable()
export class DiagramLinkService {

  constructor(private http: HttpClient) { }

  getVersionDescendants(type: LinkType, versionId: string, linkId: string): Observable<any> {
    return this.http.get<any>(`/${versionId}/${type}/link/${linkId}/descendants`);
  }
}
