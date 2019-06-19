import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private router: Router) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const helper = new JwtHelperService();
    const token = localStorage.getItem('access_token');
    const isExpired = helper.isTokenExpired(token);
    console.log(isExpired);

    if (isExpired) {
      this.router.navigate(['auth/login']);
    } else if (token) {
      // Use Json Server for mock data
      console.log(request.url);
      if (request.url.includes('radio') || request.url.includes('attributes')) {
        request = request.clone({
          url: `http://localhost:3000${request.url}`
        })
      } else {
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
