import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import {
  WorkPackageEntitiesHttpParams,
  WorkPackageEntitiesResponse
} from '@app/workpackage/store/models/workpackage.models';
import { RadioEntitiesHttpParams, RadioEntitiesResponse } from '@app/radio/store/models/radio.model';
import { GetLayoutEntitiesApiResponse, LayoutEntitiesHttpParams } from '@app/layout/store/models/layout.model';
import { UserApiResponse } from '@app/settings/store/models/user.model';

export enum HomePageActionTypes {
  LoadMyWorkPackages = '[HomePage] Load My WorkPackages',
  LoadMyWorkPackagesSuccess = '[HomePage] Load My WorkPackages Success',
  LoadMyWorkPackagesFailure = '[HomePage] Load My WorkPackages Failure',

  LoadMyRadios = '[HomePage] Load My Radios',
  LoadMyRadiosSuccess = '[HomePage] Load My Radios Success',
  LoadMyRadiosFailure = '[HomePage] Load My Radios Failure',

  LoadMyLayouts = '[HomePage] Load My Layouts',
  LoadMyLayoutsSuccess = '[HomePage] Load My Layouts Success',
  LoadMyLayoutsFailure = '[HomePage] Load My Layouts Failure',

  LoadMyProfile = '[HomePage] Load My Profile',
  LoadMyProfileSuccess = '[HomePage] Load My Profile Success',
  LoadMyProfileFailure = '[HomePage] Load My Profile Failure'
}

export class LoadMyWorkPackages implements Action {
  readonly type = HomePageActionTypes.LoadMyWorkPackages;
  constructor(public payload: WorkPackageEntitiesHttpParams) {}
}

export class LoadMyWorkPackagesSuccess implements Action {
  readonly type = HomePageActionTypes.LoadMyWorkPackagesSuccess;
  constructor(public payload: WorkPackageEntitiesResponse) {}
}

export class LoadMyWorkPackagesFailure implements Action {
  readonly type = HomePageActionTypes.LoadMyWorkPackagesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadMyRadios implements Action {
  readonly type = HomePageActionTypes.LoadMyRadios;
  constructor(public payload: RadioEntitiesHttpParams) {}
}

export class LoadMyRadiosSuccess implements Action {
  readonly type = HomePageActionTypes.LoadMyRadiosSuccess;
  constructor(public payload: RadioEntitiesResponse) {}
}

export class LoadMyRadiosFailure implements Action {
  readonly type = HomePageActionTypes.LoadMyRadiosFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadMyLayouts implements Action {
  readonly type = HomePageActionTypes.LoadMyLayouts;
  constructor(public payload: LayoutEntitiesHttpParams) {}
}

export class LoadMyLayoutsSuccess implements Action {
  readonly type = HomePageActionTypes.LoadMyLayoutsSuccess;
  constructor(public payload: GetLayoutEntitiesApiResponse) {}
}

export class LoadMyLayoutsFailure implements Action {
  readonly type = HomePageActionTypes.LoadMyLayoutsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadMyProfile implements Action {
  readonly type = HomePageActionTypes.LoadMyProfile;
  constructor() {}
}

export class LoadMyProfileSuccess implements Action {
  readonly type = HomePageActionTypes.LoadMyProfileSuccess;
  constructor(public payload: UserApiResponse) {}
}

export class LoadMyProfileFailure implements Action {
  readonly type = HomePageActionTypes.LoadMyProfileFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type HomePageActionsUnion =
  | LoadMyWorkPackages
  | LoadMyWorkPackagesSuccess
  | LoadMyWorkPackagesFailure
  | LoadMyRadios
  | LoadMyRadiosSuccess
  | LoadMyRadiosFailure
  | LoadMyLayouts
  | LoadMyLayoutsSuccess
  | LoadMyLayoutsFailure
  | LoadMyProfile
  | LoadMyProfileSuccess
  | LoadMyProfileFailure;
