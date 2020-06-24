export interface NodesApiResponse {
  data?: (Node)[] | null;
}

export interface NodeApiResponse {
  data: Node;
}

export interface CustomPropertyApiRequest {
  data: CustomPropertyValuesEntity;
}

export enum middleOptions {
  none = 'none',
  children = 'children',
  groupList = 'group list',
  group = 'group'
}

export interface NodeExpandedStateApiRequest {
  data: {
    id: string;
    middleExpanded?: middleOptions;
    bottomExpanded?: boolean;
  };
}

export interface GroupAreaSizeApiRequest {
  data: {
    id: string;
    areaSize: string;
  }[];
}

export interface WorkPackageNodeDescendantsApiResponse {
  data: (DescendantsEntity)[] | null;
}

export interface WorkPackageGroupMembersApiResponse {
  data: {
    id: string,
    layer: layers,
    category: nodeCategories,
    name: string,
    tags: string
  }[];
}

export enum layers {
  system = 'system',
  data = 'data',
  dimension = 'dimension',
  reportingConcept = 'reporting concept'
}

export enum nodeCategories {
  transactional = 'transactional',
  analytical = 'analytical',
  file = 'file',
  reporting = 'reporting',
  masterData = 'master data',
  dataStructure = 'data structure',
  dataSet = 'data set',
  masterDataSet = 'master data set',
  dimension = 'dimension',
  list = 'list',
  structure = 'structure',
  key = 'key',
  transformation = 'transformation',
  data = 'data',
  copy = 'copy'
}

export enum endPointTypes {
  source = 'source',
  target = 'target',
  none = ''
}

export class Node {
  id: string;
  layer: string;
  isGroup?: boolean;
  group?: string;
  displayId?: string;
  name: string;
  description = '';
  category: nodeCategories;
  tags: Tag[] = [];
  positionPerLayout: NodeLayoutSettingsEntity[];
  owners?: (OwnersEntity)[] | null;
  descendants: DescendantsEntity[] = [];
  relatedRadioCount: number;
  relatedRadioCounts: {
    risks: number;
    issues: number;
    assumptions: number;
    dependencies: number;
    opportunities: number;
  };
  impactedByWorkPackages = [];
  tooltip?: string;
  sortOrder?: number;
  endPointType?: endPointTypes;
  isTemporary: boolean;
  isShared: boolean;

  constructor(options: { id: string;
    name: string;
    layer: layers;
    category: nodeCategories;
    tooltip: string;
    isTemporary?: boolean;
    isShared?: boolean; }) {
    if (options) {
      this.id = options.id;
      this.name = options.name;
      this.layer = options.layer;
      this.category = options.category;
      this.isGroup = [layers.system, layers.data].includes(options.layer) && options.category !== nodeCategories.transformation;
      this.tooltip = options.tooltip;
      this.isTemporary = options.isTemporary || false;
      this.isShared = options.isShared || false;
      this.owners = [];
      this.impactedByWorkPackages = [];
    }
  }
}
export interface LocationsEntity {
  layout: Layout;
  locationCoordinates: string;
}
export interface ExpandedStatesEntity {
  layout: Layout;
  middleExpanded: middleOptions;
  bottomExpanded: boolean;
}
export interface GroupAreaSizesEntity {
  layout: Layout;
  areaSize: string;
}

export interface NodeLayoutSettingsEntity {
  layout: {
    id: string
    positionSettings: {
      locationCoordinates?: string;
      middleExpanded?: middleOptions,
      bottomExpanded?: boolean,
      areaSize?: string
    }
  };
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
  isGroup?: boolean;
  group?: string;
  tags: Tag[];
  isShared: boolean;
  groupinfo?: GroupInfo;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  systems?: (GroupInfo)[] | null;
  dataSets?: (GroupInfo)[] | null;
  dimensions?: (GroupInfo)[] | null;
  reportingConcepts?: (GroupInfo)[] | null;
  descendants?: (DescendantsEntity)[] | null;
  attributes?: (AttributesEntity)[] | null;
  relatedRadios?: (RelatedRadiosEntity)[] | null;
  relatedWorkPackages?: (RelatedWorkPackagesEntity)[] | null;
  customPropertyValues?: (CustomPropertyValuesEntity)[] | null;
  members?: (GroupInfo[]) | null;
  master?: GroupInfo;
}
export interface GroupInfo {
  id: string;
  layer: string;
  name: string;
  reference: string;
  description: string;
  category: string;
  tags: (Tag)[] | null;
  group: string;
  sortOrder: number;
  direct: boolean;
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
  type?: string;
  value: string;
}

export interface NodeLocationsUpdatePayload {
  layoutId: string;
  nodes: {
    id: string;
    locationCoordinates: string;
  }[];
}

export interface NodeReportsApiResponse {
  data?: (NodeReports)[] | null;
}

export interface NodeReports {
  id: string;
  name: string;
  system: System;
  owners: (OwnersEntity)[] | null;
}

export interface System {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  applicableTo: TagApplicableTo[];
  textColour: TagColour;
  backgroundColour: TagColour;
  iconName: TagIcon;
}

export enum TagColour {
  'white' = '#ffffff',
  'brown' = '#ad7307',
  'black' = '#000000',
  'yellow' = '#ffff19',
  'orange' = '#ff7400',
  'red' = '#ff0000',
  'green' = '#008000',
  'purple' = '#d37cb1',
  'blue' = '#0741ad',

}

export enum TagApplicableTo {
  everywhere = 'everywhere',
  systems = 'systems',
  system_links = 'system links',
  data_nodes = 'data nodes',
  data_links = 'data links',
  dimensions = 'dimensions',
  dimension_links = 'dimension links',
  reporting_concepts = 'reporting concepts',
  reporting_concept_links = 'reporting concept links',
  reports = 'reports',
  RADIO = 'radio'
}

export enum TagIcon {
  tag_cloud = 'tag_cloud',
  tag_external = 'tag_external',
  tag_process = 'tag_process',
  tag_timer = 'tag_timer',
  tag_user = 'tag_user'
}

// id	string($UUID)
// name	string
// applicableTo	[...]
// textColour	string($HEX)
// backgroundColour	string($HEX)
// iconName	string

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

export enum LoadingStatus {
  loading,
  loaded,
  error
}

export interface TagsHttpParams {
  textFilter: string;
  page?: number;
  size?: number;
  totalObjects?: number;
  totalPages?: number;
}
