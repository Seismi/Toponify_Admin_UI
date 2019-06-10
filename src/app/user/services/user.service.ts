import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddUserApiResponse, GetUserApiResponse, GetUserEntitiesApiResponse,
  UpdateUserApiResponse, UserDetails, UserEntitiesHttpParams, UserLoginData } from '../store/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(queryParams: UserEntitiesHttpParams): Observable<GetUserEntitiesApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<GetUserEntitiesApiResponse>(`/users`, {params: params});
  }

  getUser(id: string): Observable<GetUserApiResponse> {
    return this.http.get<GetUserApiResponse>(`/users/${id}`);
  }

  addUser(data: UserDetails): Observable<AddUserApiResponse> {
    return this.http.post<AddUserApiResponse>(`/users`, {data: data}, httpOptions);
  }

  updateUser(id: string, data: UserDetails): Observable<UpdateUserApiResponse> {
    return this.http.put<UpdateUserApiResponse>(`/users/${id}`, {data: data}, httpOptions);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`/users/${id}`);
  }

  loginUser(data: UserLoginData): Observable<any> {
    return this.http.post<any>(`/users/login`, {data: data}, httpOptions);
  }

  logoutUser(): Observable<any> {
    return this.http.post<any>(`/users/logout`, {}, httpOptions);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj)
        .reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
