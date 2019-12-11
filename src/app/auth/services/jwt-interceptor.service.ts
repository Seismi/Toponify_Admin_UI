import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('access_token');
    const isExpired = helper.isTokenExpired(token);
    console.log(isExpired);

    if (isExpired) {
      if (request.url.includes('users/login')) {
        return next.handle(request);
      } else {
        this.router.navigate(['auth/login']);
        return EMPTY;
      }
    } else if (token) {
      if (!request.url.includes('assets/node-icons')) {
        request = request.clone({
          url: environment.api + request.url,
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
