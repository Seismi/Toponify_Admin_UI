import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HomePageService } from '@app/home/services/home.service';
import { LoadMyWorkPackages, HomePageActionTypes, LoadMyWorkPackagesSuccess, LoadMyWorkPackagesFailure, LoadMyRadios, LoadMyRadiosSuccess, LoadMyRadiosFailure, LoadMyLayouts, LoadMyLayoutsSuccess, LoadMyLayoutsFailure } from '../actions/home.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { WorkPackageEntitiesHttpParams, WorkPackageEntitiesResponse } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntitiesHttpParams, RadioEntitiesResponse } from '@app/radio/store/models/radio.model';
import { LayoutEntitiesHttpParams, GetLayoutEntitiesApiResponse } from '@app/layout/store/models/layout.model';


@Injectable()
export class HomePageEffects {
  constructor(
    private actions$: Actions,
    private homePageService: HomePageService,
  ) { }

  @Effect()
  loadMyWorkPackages$ = this.actions$.pipe(
    ofType<LoadMyWorkPackages>(HomePageActionTypes.LoadMyWorkPackages),
    map(action => action.payload),
    switchMap((payload: WorkPackageEntitiesHttpParams) => {
      return this.homePageService.getMyWorkPackages(payload).pipe(
        switchMap((response: WorkPackageEntitiesResponse) => [new LoadMyWorkPackagesSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new LoadMyWorkPackagesFailure(error)))
      );
    })
  );

  @Effect()
  loadMyRadios$ = this.actions$.pipe(
    ofType<LoadMyRadios>(HomePageActionTypes.LoadMyRadios),
    map(action => action.payload),
    switchMap((payload: RadioEntitiesHttpParams) => {
      return this.homePageService.getMyRadios(payload).pipe(
        switchMap((response: RadioEntitiesResponse) => [new LoadMyRadiosSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new LoadMyRadiosFailure(error)))
      );
    })
  );

  @Effect()
  loadMyLayouts$ = this.actions$.pipe(
    ofType<LoadMyLayouts>(HomePageActionTypes.LoadMyLayouts),
    map(action => action.payload),
    switchMap((payload: LayoutEntitiesHttpParams) => {
      return this.homePageService.getMyLayouts(payload).pipe(
        switchMap((response: GetLayoutEntitiesApiResponse) => [new LoadMyLayoutsSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new LoadMyLayoutsFailure(error)))
      );
    })
  );
}