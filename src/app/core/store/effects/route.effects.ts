import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouteService } from '@app/core/services/route.service';
import { ResetQueryParams, RouteActionTypes, UpdateQueryParams } from '@app/core/store/actions/route.actions';
import { Params } from '@angular/router';

@Injectable()
export class RouteEffects {
  constructor(private actions$: Actions, private routeService: RouteService) {}

  @Effect({ dispatch: false })
  updateQueryParams$ = this.actions$.pipe(
    ofType<UpdateQueryParams>(RouteActionTypes.UpdateQueryParams),
    map(action => action.payload),
    switchMap((queryParams: Params) => {
      return of(this.routeService.updateQueryParams(queryParams));
    })
  );

  @Effect({ dispatch: false })
  resetQueryParams$ = this.actions$.pipe(
    ofType<ResetQueryParams>(RouteActionTypes.ResetQueryParams),
    map(action => action.payload),
    switchMap((queryParams: Params) => {
      return of(this.routeService.resetQueryParams(queryParams));
    })
  );
}
