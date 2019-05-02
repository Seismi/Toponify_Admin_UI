
export interface WorkPackageEntitiesResponse {
  data?: (WorkPackageEntity)[] | null;
  links: Links;
  page: Page;
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

export interface WorkPackageEntity {
  id: string;
  name: string;
  description: string;
  owners?: (OwnersEntityOrApproversEntity)[] | null;
  approvers?: (OwnersEntityOrApproversEntity)[] | null;
  hasErrors: boolean;
  status: string;
}

export interface OwnersEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}

export interface WorkPackageEntitiesHttpParams {
  ownerQuery?: string;
  scopeQuery?: string;
  page?: string;
  size?: string;
}

export interface WorkPackageApiRequest {
  data: WorkPackageEntity;
}
