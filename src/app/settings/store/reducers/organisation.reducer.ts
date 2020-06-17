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
    case OrganisationActionTypes.LoadOrganisationName: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.LoadOrganisationDomain: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.LoadOrganisationLicenceInfo: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.LoadOrganisationEmailDomains: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.UpdateOrganisationEmailDomains: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.LoadOrganisationAccountAdmins: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.AddOrganisationAccountAdmins: {
      return {
        ...initialState
      };
    }

    case OrganisationActionTypes.DeleteOrganisationAccountAdmins: {
      return {
        ...initialState
      };
    }

    default: {
      return state;
    }
  }
}
