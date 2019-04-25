import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelApiResponse, ModelSingleApiResponse, ModelApiRequest } from '../store/models/model-version.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ModelService {

  constructor(private http: HttpClient) { }

  getModels(versionId: string): Observable<ModelApiResponse> {
    return this.http.get<ModelApiResponse>(`/${versionId}/model`);
  }

  addModel(model: ModelApiRequest, versionId: string): Observable<ModelSingleApiResponse> {
    return this.http.post<any>(`/${versionId}/model`, model, httpOptions);
  }

  updateModel(model: ModelApiRequest, versionId: string): Observable<ModelSingleApiResponse> {
    return this.http.put<any>(`/${versionId}/model`, model, httpOptions);
  }

  deleteModel(versionId: string, modelId: string): Observable<any> {
    return this.http.delete<any>(`/${versionId}/model/${modelId}`);
  }

}
