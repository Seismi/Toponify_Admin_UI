import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WorkPackageService, WorkPackgeListHttpParams } from '@app/workpackage/services/workpackage.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoadWorkPackages, LoadWorkPackagesFailure, LoadWorkPackagesSuccess, WorkPackageActionTypes } from '../actions/workpackage.actions';


@Injectable()
export class WorkPackageEffects {
  constructor(
    private actions$: Actions,
    private workpackageService: WorkPackageService
  ) {}

  @Effect()
  loadWorkPackageList$ = this.actions$.pipe(
    ofType<LoadWorkPackages>(WorkPackageActionTypes.LoadWorkPackages),
    map(action => action.payload),
    switchMap((payload: WorkPackgeListHttpParams) => {
      return this.workpackageService.getWorkPackageList(payload).pipe(
        switchMap((list: any[]) => [new LoadWorkPackagesSuccess(list)]),
        catchError((error: HttpErrorResponse) => of(new LoadWorkPackagesFailure(error)))
      );
    })
  );
}
