export interface WorkPackageStatePage {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface WorkPackageStateLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
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
