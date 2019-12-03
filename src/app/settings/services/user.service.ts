import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UserEntitiesHttpParams,
  UserDetails,
  UserLoginData,
  UsersApiResponse,
  UserRolesApiResponse,
  UpdateUserApiRequest,
  UpdateUserApiResponse,
  UserPassword
} from '../store/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(queryParams: UserEntitiesHttpParams): Observable<UsersApiResponse> {
    const params = this.toHttpParams(queryParams);
    return this.http.get<UsersApiResponse>(`/users`, { params: params });
  }

  getUserRoles(): Observable<UserRolesApiResponse> {
    return this.http.get<UserRolesApiResponse>(`/roles`);
  }

  getUser(id: string): Observable<any> {
    return this.http.get<any>(`/users/${id}`);
  }

  addUser(data: UserDetails): Observable<any> {
    return this.http.post<any>(`/users`, { data: data }, httpOptions);
  }

  updateUser(id: string, data: UserDetails): Observable<any> {
    return this.http.put<any>(`/users/${id}`, { data: data }, httpOptions);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`/users/${id}`);
  }

  updateUserPassword(user: UserPassword): Observable<any> {
    return this.http.put<any>(`/users/password/change`, { data: user }, httpOptions);
  }

  loginUser(data: UserLoginData): Observable<any> {
    return this.http.post<any>(`/users/login`, { data: data }, httpOptions);
  }

  logoutUser(): Observable<any> {
    return this.http.post<any>(`/users/logout`, {}, httpOptions);
  }

  // TODO: move into sharable service
  toHttpParams(obj: Object): HttpParams {
    return Object.getOwnPropertyNames(obj).reduce((p, key) => p.set(key, obj[key]), new HttpParams());
  }
}
