import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEntitiesHttpParams, UserDetails, AddUserApiResponse, UpdateUserApiResponse, UserLoginData, UsersApiResponse, User, UserDetailResponse } from '../store/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(queryParams: UserEntitiesHttpParams): Observable<UsersApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<UsersApiResponse>(`/users`, {params: params});
  }

  getUser(id: string): Observable<UserDetailResponse> {
    return this.http.get<UserDetailResponse>(`/users/${id}`);
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
