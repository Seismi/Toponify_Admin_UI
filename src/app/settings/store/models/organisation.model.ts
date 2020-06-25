export interface OrganisationName {
  name: string;
}

export interface OrganisationDomain {
  domain: string;
}

export interface OrganisationLicenceInfo {
  licenceType: string;
  maxUsers: number;
  activeUsers: number;
}

export interface OrganisationEmailDomains {
  emailDomains: string[];
}

export interface OrganisationAccountAdmins {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

