import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '@app/core/store';
import { ShowError } from '@app/core/store/actions/error.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor( private router: Router, private store: Store<State>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.method === 'GET') {
      return next.handle(request).pipe(
        retry(3),
        catchError((err) => {
          if (err.status === 403) {
            this.store.dispatch( new ShowError('Insufficient privileges'));
            return throwError(err);
          }
          if (err.status !== 401) {
            this.router.navigate(['/error']);
          }
          return throwError(err);
        })
      );
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 403) {
          this.store.dispatch( new ShowError('Insufficient privileges'));
          return throwError(err);
        }
        if (err.status !== 401) {
          this.store.dispatch( new ShowError(`Error -  ${err.message}`));
        }
        return throwError(err);
      })
    );
  }
}
