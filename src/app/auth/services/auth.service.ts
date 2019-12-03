import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { User, AuthenticateApiResponse } from '../store/models/user.model';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthenticateApiResponse>(
        `${environment.api}/users/login`,
        { data: { username: username, password: password } },
        httpOptions
      )
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.data.private.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['auth/login']);
  }

  // TODO: Move to Store
  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }
}
