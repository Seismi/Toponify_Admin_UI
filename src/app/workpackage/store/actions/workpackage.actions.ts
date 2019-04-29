import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { WorkPackgeListHttpParams } from '@app/workpackage/services/workpackage.service';

export enum WorkPackageActionTypes {
  LoadWorkPackages = '[WorkPackage] Load WorkPackage list',
  LoadWorkPackagesSuccess = '[WorkPackage] Load WorkPackage list success',
  LoadWorkPackagesFailure = '[WorkPackage] Load WorkPackage list failure',
  LoadWorkPackage = '[WorkPackage] Load WorkPackage item',
  LoadWorkPackageSuccess = '[WorkPackage] Load WorkPackage item success',
  LoadWorkPackageFailure = '[WorkPackage] Load WorkPackage item failure',
}

export class LoadWorkPackages implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackages;
  constructor(public payload: WorkPackgeListHttpParams) {}
}

export class LoadWorkPackagesSuccess implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackagesSuccess;
  constructor(public payload: any[]) {}
}

export class LoadWorkPackagesFailure implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackagesFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadWorkPackage implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackage;
  constructor(public payload: any) {}
}

export class LoadWorkPackageSuccess implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageSuccess;
  constructor(public payload: any) {}
}

export class LoadWorkPackageFailure implements Action {
  readonly type = WorkPackageActionTypes.LoadWorkPackageFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type WorkPackageActionsUnion =
  | LoadWorkPackages
  | LoadWorkPackagesSuccess
  | LoadWorkPackagesFailure
  | LoadWorkPackage
  | LoadWorkPackageSuccess
  | LoadWorkPackageFailure;
