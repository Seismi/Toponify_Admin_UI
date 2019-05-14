// Responses
export interface GetLayoutEntitiesApiResponse {
  data?: (LayoutEntity)[] | null;
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
}

export interface OwnersEntityOrViewersEntity {
  id: string;
  name: string;
  type: string;
}

export interface Scope {
  id: string;
  name: string;
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

