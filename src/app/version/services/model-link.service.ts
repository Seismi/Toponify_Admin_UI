import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelLinkApiResponse, ModelLinkApiRequest, ModelLinkSingleApiResponse } from '../store/models/model-links.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ModelLinkService {

  constructor(private http: HttpClient) { }

  getModelLinks(versionId: string): Observable<ModelLinkApiResponse> {
    return this.http.get<ModelLinkApiResponse>(`/${versionId}/model/link`);
  }

  addModelLink(modelLink: ModelLinkApiRequest, versionId: string): Observable<ModelLinkSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/model/link`, modelLink, httpOptions);
  }

  updateModelLink(modelLink: ModelLinkApiRequest, versionId: string): Observable<ModelLinkSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/model/link`, modelLink, httpOptions);
  }

  deleteModelLink(versionId: string, modelLinkId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/model/link/${modelLinkId}`);
  }

}
