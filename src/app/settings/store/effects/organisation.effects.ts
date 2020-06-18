import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import * as OrganisationActions from '../actions/organisation.actions';
import { OrganisationActionTypes } from '../actions/organisation.actions';
import { OrganisationService } from '@app/settings/services/organisation.service';
import {
  OrganisationName,
  OrganisationDomain,
  OrganisationLicenceInfo,
  OrganisationEmailDomains,
  OrganisationAccountAdmins
} from '../models/organisation.model';

@Injectable()
export class OrganisationEffects {
  constructor(private actions$: Actions, private organisationService: OrganisationService) {}

  @Effect()
  loadOrganisationName$ = this.actions$.pipe(
    ofType<OrganisationActions.LoadOrganisationName>(OrganisationActionTypes.LoadOrganisationName),
    switchMap(() => {
      return this.organisationService.getName().pipe(
        switchMap((response: { data: OrganisationName }) => [new OrganisationActions.LoadOrganisationNameSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.LoadOrganisationNameFailure(error)))
      );
    })
  );

  @Effect()
  loadOrganisationDomain$ = this.actions$.pipe(
    ofType<OrganisationActions.LoadOrganisationDomain>(OrganisationActionTypes.LoadOrganisationDomain),
    switchMap(() => {
      return this.organisationService.getDomain().pipe(
        switchMap((response: { data: OrganisationDomain }) => [new OrganisationActions.LoadOrganisationDomainSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.LoadOrganisationDomainFailure(error)))
      );
    })
  );

  @Effect()
  loadOrganisationLicenceInfo$ = this.actions$.pipe(
    ofType<OrganisationActions.LoadOrganisationLicenceInfo>(OrganisationActionTypes.LoadOrganisationLicenceInfo),
    switchMap(() => {
      return this.organisationService.getLicenceInfo().pipe(
        switchMap((response: { data: OrganisationLicenceInfo }) => [
          new OrganisationActions.LoadOrganisationLicenceInfoSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.LoadOrganisationLicenceInfoFailure(error)))
      );
    })
  );

  @Effect()
  loadOrganisationEmailDomains$ = this.actions$.pipe(
    ofType<OrganisationActions.LoadOrganisationEmailDomains>(OrganisationActionTypes.LoadOrganisationEmailDomains),
    switchMap(() => {
      return this.organisationService.getEmailDomains().pipe(
        switchMap((response: { data: OrganisationEmailDomains }) => [
          new OrganisationActions.LoadOrganisationEmailDomainsSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.LoadOrganisationEmailDomainsFailure(error)))
      );
    })
  );

  @Effect()
  updateOrganisationEmailDomains$ = this.actions$.pipe(
    ofType<OrganisationActions.UpdateOrganisationEmailDomains>(OrganisationActionTypes.UpdateOrganisationEmailDomains),
    map(action => action.payload),
    switchMap((payload: OrganisationEmailDomains) => {
      return this.organisationService.updateEmailDomains(payload).pipe(
        switchMap((response: { data: OrganisationEmailDomains }) => [
          new OrganisationActions.UpdateOrganisationEmailDomainsSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.UpdateOrganisationEmailDomainsFailure(error)))
      );
    })
  );

  @Effect()
  loadOrganisationAccountAdmins$ = this.actions$.pipe(
    ofType<OrganisationActions.LoadOrganisationAccountAdmins>(OrganisationActionTypes.LoadOrganisationAccountAdmins),
    switchMap(() => {
      return this.organisationService.getAccountAdmins().pipe(
        switchMap((response: { data: OrganisationAccountAdmins[] }) => [
          new OrganisationActions.LoadOrganisationAccountAdminsSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.LoadOrganisationAccountAdminsFailure(error)))
      );
    })
  );

  @Effect()
  addOrganisationAccountAdmins$ = this.actions$.pipe(
    ofType<OrganisationActions.AddOrganisationAccountAdmins>(OrganisationActionTypes.AddOrganisationAccountAdmins),
    map(actions => actions.payload),
    switchMap((payload: { userId: string }) => {
      return this.organisationService.addAccountAdmins(payload.userId).pipe(
        switchMap((response: { data: OrganisationAccountAdmins[] }) => [
          new OrganisationActions.AddOrganisationAccountAdminsSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.AddOrganisationAccountAdminsFailure(error)))
      );
    })
  );

  @Effect()
  deleteOrganisationAccountAdmins$ = this.actions$.pipe(
    ofType<OrganisationActions.DeleteOrganisationAccountAdmins>(OrganisationActionTypes.DeleteOrganisationAccountAdmins),
    map(actions => actions.payload),
    switchMap((payload: { userId: string }) => {
      return this.organisationService.deleteAccountAdmins(payload.userId).pipe(
        switchMap((response: { data: OrganisationAccountAdmins[] }) => [
          new OrganisationActions.DeleteOrganisationAccountAdminsSuccess(response.data)
        ]),
        catchError((error: HttpErrorResponse) => of(new OrganisationActions.DeleteOrganisationAccountAdminsFailure(error)))
      );
    })
  );
}
