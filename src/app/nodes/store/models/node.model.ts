export interface NodesApiResponse {
  data?: (Node)[] | null;
}
export interface Node {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  locations?: ((LocationsEntity)[] | null)[] | null;
  owners?: (OwnersEntity)[] | null;
}
export interface LocationsEntity {
  layout: Layout;
  locationCoordinates: string;
}
export interface Layout {
  id: string;
  name: string;
}
export interface OwnersEntity {
  id: string;
  name: string;
  type: string;
}

// TODO Extend this off Node 

export interface NodeDetailApiResponse {
  data: NodeDetail;
}
export interface NodeDetail {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  descendants?: (DescendantsEntity)[] | null;
  locations?: ((LocationsEntityEntity)[] | null)[] | null;
  attributes?: (AttributesEntity)[] | null;
  relatedRadios?: (RelatedRadiosEntity)[] | null;
  relatedWorkPackages?: (RelatedWorkPackagesEntity)[] | null;
  customPropertyValues?: (CustomPropertyValuesEntity)[] | null;
}
export interface OwnersEntityOrTeamEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}
export interface DescendantsEntity {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  locations?: ((LocationsEntityEntity)[] | null)[] | null;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
}
export interface LocationsEntityEntity {
  layout: LayoutOrRolesEntity;
  locationCoordinates: string;
}
export interface LayoutOrRolesEntity {
  id: string;
  name: string;
}
export interface AttributesEntity {
  id: string;
  category: string;
  name: string;
  description: string;
  tags: string;
  related?: (null)[] | null;
}
export interface RelatedRadiosEntity {
  id: string;
  title: string;
  commentText: string;
  category: string;
  author: AuthorOrLastUpdatedBy;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  status: string;
  createdOn: string;
  lastUpdatedOn: string;
  lastUpdatedBy: AuthorOrLastUpdatedBy;
  replyCount: number;
}
export interface AuthorOrLastUpdatedBy {
  id: string;
  firstName: string;
  lastName: string;
  team?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  email: string;
  phone: string;
  roles?: (LayoutOrRolesEntity)[] | null;
}
export interface RelatedWorkPackagesEntity {
  id: string;
  name: string;
  description: string;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  approvers?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  hasErrors: boolean;
  status: string;
}
export interface CustomPropertyValuesEntity {
  propertyId: string;
  value: string;
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

