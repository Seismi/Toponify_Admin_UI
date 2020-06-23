import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/organisation.reducer';

export const getOrganisationFeatureState = createFeatureSelector<State>('organisationFeature');

export const getOrganisationName = createSelector(
  getOrganisationFeatureState,
  state => state.name
);

export const getOrganisationDomain = createSelector(
  getOrganisationFeatureState,
  state => state.domain
);

export const getOrganisationLicenceInfo = createSelector(
  getOrganisationFeatureState,
  state => state.licenceInfo
);

export const getOrganisationAccountAdmins = createSelector(
  getOrganisationFeatureState,
  state => state.accountAdmins
);

export const getOrganisationEmailDomains = createSelector(
  getOrganisationFeatureState,
  state => state.emailDomains
);
