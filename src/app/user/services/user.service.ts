import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserApiResponse, UpdateUserApiRequest, UpdateUserApiResponse, AddUserApiRequest, AddUserApiResponse } from '../store/models/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    getUsers(): Observable<UserApiResponse> {
        return this.http.get<UserApiResponse>(`/user`);
    }

    getUser(id: string): Observable<any> {
      return this.http.get<any>(`/user/${id}`);
    }

    updateUser(user: UpdateUserApiRequest): Observable<UpdateUserApiResponse> {
      return this.http.put<any>('/user/', user, httpOptions);
    }
    
    addUser(request: AddUserApiRequest): Observable<AddUserApiResponse> {
      return this.http.post<any>('/user', request, httpOptions);
    }

}
