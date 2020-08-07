export const defaultLayoutId = '00000000-0000-0000-0000-000000000000';

export interface GetLayoutEntitiesApiResponse {
  data: LayoutDetails[];
  links: Links;
  page: Page;
}

export interface GetLayoutApiResponse {
  data: LayoutDetails;
}

export interface AddLayoutApiResponse {
  data: LayoutDetails;
}

export interface UpdateLayoutApiResponse {
  data: LayoutDetails;
}

export interface LayoutEntity {
  id: string;
  name: string;
}

export interface LayoutEntitiesHttpParams {
  ownerQuery?: string;
  scopeQuery?: string;
  page?: number;
  size?: number;
}

export interface LayoutDetails {
  id: string;
  name: string;
  owners?: (OwnersEntityOrViewersEntity)[] | null;
  viewers?: (OwnersEntityOrViewersEntity)[] | null;
  scope: Scope;
  settings?: LayoutSettings;
}

export interface LayoutSettings {
  components?: LayoutComponents;
  links?: LayoutLinks;
}

export interface LayoutComponents {
  showTags: boolean;
  showRADIO: boolean;
  filterRADIOSeverity: number;
  showDescription: boolean;
  showOwners: boolean;
  showNextLevel: boolean;
  showAttributes: boolean;
  showRules: boolean;
}

export interface LayoutLinks {
  showDataLinks: boolean;
  showMasterDataLinks: boolean;
  showName: boolean;
  showRADIO: boolean;
  filterRADIOSeverity: number;
  showAttributes: boolean;
  showRules: boolean;
}

export interface OwnersEntityOrViewersEntity {
  id: string;
  name: string;
  type: string;
}

export interface Scope {
  id: string;
  name?: string;
}

// TODO: This may be shared at some point
export interface Error {
  errors?: (ErrorsEntity)[] | null;
}
export interface ErrorsEntity {
  status: number;
  source: Source;
}
export interface Source {
  pointer: string;
  title: string;
  detail: string;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}
