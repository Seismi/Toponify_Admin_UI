import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddTeamApiResponse, GetTeamApiResponse, GetTeamEntitiesApiResponse,
  TeamDetails, TeamEntitiesHttpParams, UpdateTeamApiResponse } from '../store/models/team.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class TeamService {

  constructor(private http: HttpClient) { }

  getTeams(queryParams: TeamEntitiesHttpParams): Observable<GetTeamEntitiesApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<GetTeamEntitiesApiResponse>(`/teams`, {params: params});
  }

  getTeam(id: string): Observable<GetTeamApiResponse> {
    return this.http.get<GetTeamApiResponse>(`/teams/${id}`);
  }

  addTeam(data: TeamDetails): Observable<AddTeamApiResponse> {
    return this.http.post<AddTeamApiResponse>(`/teams`, {data: data}, httpOptions);
  }

  updateTeam(id: string, data: TeamDetails): Observable<UpdateTeamApiResponse> {
    return this.http.put<UpdateTeamApiResponse>(`/teams/${id}`, {data: data}, httpOptions);
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete<any>(`/teams/${id}`);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
