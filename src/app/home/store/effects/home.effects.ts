import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HomePageService } from '@app/home/services/home.service';
import {
  HomePageActionTypes,
  LoadMyProfile,
  LoadMyProfileFailure,
  LoadMyProfileSuccess,
  LoadMyRadios,
  LoadMyRadiosFailure,
  LoadMyRadiosSuccess,
  LoadMyWorkPackages,
  LoadMyWorkPackagesFailure,
  LoadMyWorkPackagesSuccess,
  LoadMyFavourites,
  LoadMyFavouritesSuccess,
  LoadMyFavouritesFailure
} from '../actions/home.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse
} from '@app/workpackage/store/models/workpackage.models';
import { RadioEntitiesHttpParams, RadioEntitiesResponse } from '@app/radio/store/models/radio.model';
import { UserApiResponse, Favourites } from '@app/settings/store/models/user.model';

@Injectable()
export class HomePageEffects {
  constructor(private actions$: Actions, private homePageService: HomePageService) {}

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
  loadMyProfile$ = this.actions$.pipe(
    ofType<LoadMyProfile>(HomePageActionTypes.LoadMyProfile),
    switchMap(_ => {
      return this.homePageService.getMyProfile().pipe(
        switchMap((response: UserApiResponse) => [new LoadMyProfileSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new LoadMyProfileFailure(error)))
      );
    })
  );

  @Effect()
  loadMyFavourites$ = this.actions$.pipe(
    ofType<LoadMyFavourites>(HomePageActionTypes.LoadMyFavourites),
    switchMap(_ => {
      return this.homePageService.getMyFavourites().pipe(
        switchMap((response: { data: Favourites[] }) => [new LoadMyFavouritesSuccess(response)]),
        catchError((error: HttpErrorResponse) => of(new LoadMyFavouritesFailure(error)))
      );
    })
  );
}
