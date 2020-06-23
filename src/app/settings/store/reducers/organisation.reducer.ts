import { HttpErrorResponse } from '@angular/common/http';
import { OrganisationActionTypes, OrganisationActionsUnion } from '../actions/organisation.actions';
import {
  OrganisationName,
  OrganisationDomain,
  OrganisationLicenceInfo,
  OrganisationEmailDomains,
  OrganisationAccountAdmins
} from '../models/organisation.model';

export interface State {
  name: OrganisationName;
  domain: OrganisationDomain;
  licenceInfo: OrganisationLicenceInfo;
  emailDomains: OrganisationEmailDomains;
  accountAdmins: OrganisationAccountAdmins[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  name: null,
  domain: null,
  licenceInfo: null,
  emailDomains: null,
  accountAdmins: [],
  error: null
};

export function reducer(state = initialState, action: OrganisationActionsUnion): State {
  switch (action.type) {
    case OrganisationActionTypes.LoadOrganisationNameSuccess: {
      return {
        ...state,
        name: action.payload
      };
    }

    case OrganisationActionTypes.LoadOrganisationDomainSuccess: {
      return {
        ...state,
        domain: action.payload
      };
    }

    case OrganisationActionTypes.LoadOrganisationLicenceInfoSuccess: {
      return {
        ...state,
        licenceInfo: action.payload
      };
    }

    case OrganisationActionTypes.UpdateOrganisationEmailDomainsSuccess:
    case OrganisationActionTypes.LoadOrganisationEmailDomainsSuccess: {
      return {
        ...state,
        emailDomains: action.payload
      };
    }

    case OrganisationActionTypes.DeleteOrganisationAccountAdminsSuccess:
    case OrganisationActionTypes.LoadOrganisationAccountAdminsSuccess: {
      return {
        ...state,
        accountAdmins: action.payload
      };
    }

    case OrganisationActionTypes.AddOrganisationAccountAdminsSuccess: {
      return {
        ...state,
        accountAdmins: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
