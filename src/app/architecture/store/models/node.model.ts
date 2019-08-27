export interface NodesApiResponse {
  data?: (Node)[] | null;
}

export interface NodeApiResponse {
  data: Node;
}

export interface CustomPropertyApiRequest {
  data: CustomPropertyValuesEntity;
}

export enum layers {
  system = 'system',
  dataSet = 'data set',
  dimension = 'dimension',
  reportingConcept = 'reporting concept'
}

export enum nodeCategories {
  transactional = 'transactional',
  analytical = 'analytical',
  file = 'file',
  reporting = 'reporting',
  masterData = 'master data',
  physical = 'physical',
  virtual = 'virtual',
  dimension = 'dimension',
  list = 'list',
  structure = 'structure',
  key = 'key'
}

export class Node {
  id: string;
  layer: string;
  name: string;
  description = '';
  category: nodeCategories;
  tags = '';
  locations?: ((LocationsEntity)[] | null)[] | null;
  owners?: (OwnersEntity)[] | null;
  descendants: DescendantsEntity[] = [];

  constructor(options: { id: string, name: string, layer: layers, category: nodeCategories }) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.layer = options.layer;
      this.category = options.category;
      this.owners = [];
    }
  }
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
  category: nodeCategories;
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
  propertyId?: string;
  name?: string;
  description?: string;
  value: string;
}


export interface NodeUpdatePayload {
  layoutId: string;
  node: {
    id: string,
    locationCoordinates: string
  };
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

