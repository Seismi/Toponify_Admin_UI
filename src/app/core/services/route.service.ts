import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(private router: Router) {}

  updateQueryParams(params: {[key: string]: any}): void {
    this.router.navigate([], {queryParams: params, queryParamsHandling: 'merge'});
  }

  resetQueryParams(params?: {[key: string]: any}): void {
    this.router.navigate([], {queryParams: params});
  }

}
