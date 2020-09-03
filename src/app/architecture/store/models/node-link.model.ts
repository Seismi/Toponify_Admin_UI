import {colourOptions} from '@app/architecture/store/models/layout.model';

export const dummyLinkId = '00000000-0000-0000-0000-000000000000';

export interface NodeLinksApiResponse {
  data?: (NodeLink)[] | null;
}

export enum linkCategories {
  data = 'data',
  masterData = 'master data',
  copy = 'copy',
  warning = 'warning'
}

export interface NodeLink {
  id: string;
  displayId?: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  positionPerLayout: LinkLayoutSettingsEntity[];
  routes?: (RoutesEntityEntity)[] | null;
  impactedByWorkPackages;
}
export interface LocationsEntityEntity {
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
export interface RoutesEntityEntity {
  layout: Layout;
  points?: (number)[] | null;
  fromSpot?: string;
  toSpot?: string;
}

// Detail
// TODO: Extend this from NodeLink
export interface NodeLinkDetailApiResponse {
  data: NodeLinkDetail;
}
export interface NodeLinkDetail {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  sourceObject: SourceObjectOrTargetObject;
  targetObject: SourceObjectOrTargetObject;
  descendants: null;
  attributes?: (AttributesEntity)[] | null;
  relatedRadios?: (RelatedRadiosEntity)[] | null;
  routes?: (RoutesEntityEntity)[] | null;
  relatedWorkPackages?: (RelatedWorkPackagesEntity)[] | null;
  customPropertyValues?: (CustomPropertyValuesEntity)[] | null;
  sliceTable: SliceTable;
}
export interface SourceObjectOrTargetObject {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  locations?: ((LocationsEntityEntity)[] | null)[] | null;
  owners?: (OwnersEntityOrTeamEntityOrApproversEntity)[] | null;
  descendants?: (null)[] | null;
}
export interface LocationsEntityEntity {
  layout: LayoutOrRolesEntity;
  locationCoordinates: string;
}
export interface LayoutOrRolesEntity {
  id: string;
  name: string;
}
export interface OwnersEntityOrTeamEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}
export interface Descendants {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  sourceObject: SourceObjectOrTargetObject;
  targetObject: SourceObjectOrTargetObject;
  routes?: (RoutesEntityEntity)[] | null;
}
export interface RoutesEntityEntity {
  layout: LayoutOrRolesEntity;
  points?: (number)[] | null;
}

export interface LinkLayoutSettingsEntity {
  layout: {
    id: string
    positionSettings: {
      route?: number[];
      fromSpot?: string;
      toSpot?: string;
      colour?: colourOptions
    }
  };
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
export interface SliceTable {
  conditionType?: (ConditionTypeEntity)[] | null;
  slices?: (SlicesEntity)[] | null;
}
export interface ConditionTypeEntity {
  id: string;
  name: string;
  orderNum: number;
}
export interface SlicesEntity {
  id: string;
  orderNum: number;
  filters?: (FiltersEntity)[] | null;
}
export interface FiltersEntity {
  conditionTypeId: string;
  value: string;
}

export interface LinkUpdatePayload {
  layoutId: string;
  links: { id: string; points: any[] }[];
}
