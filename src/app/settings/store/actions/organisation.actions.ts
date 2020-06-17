import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import {
  OrganisationName,
  OrganisationDomain,
  OrganisationLicenceInfo,
  OrganisationEmailDomains,
  OrganisationAccountAdmins
} from '../models/organisation.model';

export enum OrganisationActionTypes {
  LoadOrganisationName = '[Organisation] Load Organisation Name',
  LoadOrganisationNameSuccess = '[Organisation] Load Organisation Name Success',
  LoadOrganisationNameFailure = '[Organisation] Load Organisation Name Failure',

  LoadOrganisationDomain = '[Organisation] Load Organisation Domain',
  LoadOrganisationDomainSuccess = '[Organisation] Load Organisation Domain Success',
  LoadOrganisationDomainFailure = '[Organisation] Load Organisation Domain Failure',

  LoadOrganisationLicenceInfo = '[Organisation] Load Organisation Licence Info',
  LoadOrganisationLicenceInfoSuccess = '[Organisation] Load Organisation Licence Info Success',
  LoadOrganisationLicenceInfoFailure = '[Organisation] Load Organisation Licence Info Failure',

  LoadOrganisationEmailDomains = '[Organisation] Load Organisation Email Domains',
  LoadOrganisationEmailDomainsSuccess = '[Organisation] Load Organisation Email Domains Success',
  LoadOrganisationEmailDomainsFailure = '[Organisation] Load Organisation Email Domains Failure',

  UpdateOrganisationEmailDomains = '[Organisation] Update Organisation Email Domains',
  UpdateOrganisationEmailDomainsSuccess = '[Organisation] Update Organisation Email Domains Success',
  UpdateOrganisationEmailDomainsFailure = '[Organisation] Update Organisation Email Domains Failure',

  LoadOrganisationAccountAdmins = '[Organisation] Load Organisation Account Admins',
  LoadOrganisationAccountAdminsSuccess = '[Organisation] Load Organisation Account Admins Success',
  LoadOrganisationAccountAdminsFailure = '[Organisation] Load Organisation Account Admins Failure',

  AddOrganisationAccountAdmins = '[Organisation] Add Organisation Account Admins',
  AddOrganisationAccountAdminsSuccess = '[Organisation] Add Organisation Account Admins Success',
  AddOrganisationAccountAdminsFailure = '[Organisation] Add Organisation Account Admins Failure',

  DeleteOrganisationAccountAdmins = '[Organisation] Delete Organisation Account Admins',
  DeleteOrganisationAccountAdminsSuccess = '[Organisation] Delete Organisation Account Admins Success',
  DeleteOrganisationAccountAdminsFailure = '[Organisation] Delete Organisation Account Admins Failure'
}


export class LoadOrganisationName implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationName;
  constructor() {}
}

export class LoadOrganisationNameSuccess implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationNameSuccess;
  constructor(public payload: OrganisationName) {}
}

export class LoadOrganisationNameFailure implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationNameFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadOrganisationDomain implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationDomain;
  constructor() {}
}

export class LoadOrganisationDomainSuccess implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationDomainSuccess;
  constructor(public payload: OrganisationDomain) {}
}

export class LoadOrganisationDomainFailure implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationDomainFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadOrganisationLicenceInfo implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationLicenceInfo;
  constructor() {}
}

export class LoadOrganisationLicenceInfoSuccess implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationLicenceInfoSuccess;
  constructor(public payload: OrganisationLicenceInfo) {}
}

export class LoadOrganisationLicenceInfoFailure implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationLicenceInfoFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadOrganisationEmailDomains implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationEmailDomains;
  constructor() {}
}

export class LoadOrganisationEmailDomainsSuccess implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationEmailDomainsSuccess;
  constructor(public payload: OrganisationEmailDomains) {}
}

export class LoadOrganisationEmailDomainsFailure implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationEmailDomainsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class UpdateOrganisationEmailDomains implements Action {
  readonly type = OrganisationActionTypes.UpdateOrganisationEmailDomains;
  constructor() {}
}

export class UpdateOrganisationEmailDomainsSuccess implements Action {
  readonly type = OrganisationActionTypes.UpdateOrganisationEmailDomainsSuccess;
  constructor(public payload: OrganisationEmailDomains) {}
}

export class UpdateOrganisationEmailDomainsFailure implements Action {
  readonly type = OrganisationActionTypes.UpdateOrganisationEmailDomainsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadOrganisationAccountAdmins implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationAccountAdmins;
  constructor() {}
}

export class LoadOrganisationAccountAdminsSuccess implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationAccountAdminsSuccess;
  constructor(public payload: OrganisationAccountAdmins[]) {}
}

export class LoadOrganisationAccountAdminsFailure implements Action {
  readonly type = OrganisationActionTypes.LoadOrganisationAccountAdminsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddOrganisationAccountAdmins implements Action {
  readonly type = OrganisationActionTypes.AddOrganisationAccountAdmins;
  constructor(public payload: { userId: string }) {}
}

export class AddOrganisationAccountAdminsSuccess implements Action {
  readonly type = OrganisationActionTypes.AddOrganisationAccountAdminsSuccess;
  constructor(public payload: OrganisationAccountAdmins[]) {}
}

export class AddOrganisationAccountAdminsFailure implements Action {
  readonly type = OrganisationActionTypes.AddOrganisationAccountAdminsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class DeleteOrganisationAccountAdmins implements Action {
  readonly type = OrganisationActionTypes.DeleteOrganisationAccountAdmins;
  constructor(public payload: { userId: string }) {}
}

export class DeleteOrganisationAccountAdminsSuccess implements Action {
  readonly type = OrganisationActionTypes.DeleteOrganisationAccountAdminsSuccess;
  constructor(public payload: OrganisationAccountAdmins[]) {}
}

export class DeleteOrganisationAccountAdminsFailure implements Action {
  readonly type = OrganisationActionTypes.DeleteOrganisationAccountAdminsFailure;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type OrganisationActionsUnion =
  | LoadOrganisationName
  | LoadOrganisationNameSuccess
  | LoadOrganisationNameFailure
  | LoadOrganisationDomain
  | LoadOrganisationDomainSuccess
  | LoadOrganisationDomainFailure
  | LoadOrganisationLicenceInfo
  | LoadOrganisationLicenceInfoSuccess
  | LoadOrganisationLicenceInfoFailure
  | LoadOrganisationEmailDomains
  | LoadOrganisationEmailDomainsSuccess
  | LoadOrganisationEmailDomainsFailure
  | UpdateOrganisationEmailDomains
  | UpdateOrganisationEmailDomainsSuccess
  | UpdateOrganisationEmailDomainsFailure
  | LoadOrganisationAccountAdmins
  | LoadOrganisationAccountAdminsSuccess
  | LoadOrganisationAccountAdminsFailure
  | AddOrganisationAccountAdmins
  | AddOrganisationAccountAdminsSuccess
  | AddOrganisationAccountAdminsFailure
  | DeleteOrganisationAccountAdmins
  | DeleteOrganisationAccountAdminsSuccess
  | DeleteOrganisationAccountAdminsFailure;
