import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';

export enum WorkPackageLinkActionTypes {
  AddWorkPackageLink = '[WorkPackage] Add link',
  AddWorkPackageLinkSuccess = '[WorkPackage] Add link success',
  AddWorkPackageLinkFailure = '[WorkPackage] Add link failure',
  UpdateWorkPackageLink = '[WorkPackage] Update link',
  UpdateWorkPackageLinkSuccess = '[WorkPackage] Update link success',
  UpdateWorkPackageLinkFailure = '[WorkPackage] Update link failure',
}

export class AddWorkPackageLink implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLink;
  constructor(public payload: {workpackageId: string, link: any}) {}
}

export class AddWorkPackageLinkSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkSuccess;
  constructor(public payload: any) {}
}

export class AddWorkPackageLinkFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.AddWorkPackageLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateWorkPackageLink implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLink;
  constructor(public payload: { workpackageId: string, linkId: string, link: any }) { }
}

export class UpdateWorkPackageLinkSuccess implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkSuccess;
  constructor(public payload: any) { }
}

export class UpdateWorkPackageLinkFailure implements Action {
  readonly type = WorkPackageLinkActionTypes.UpdateWorkPackageLinkFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) { }
}

export type WorkPackageLinkActionsUnion =
  | AddWorkPackageLink
  | AddWorkPackageLinkSuccess
  | AddWorkPackageLinkFailure;

