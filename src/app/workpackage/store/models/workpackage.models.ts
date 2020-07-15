export const currentArchitecturePackageId = '00000000-0000-0000-0000-000000000000';

export interface WorkPackageEntitiesResponse {
  data?: (WorkPackageEntity)[] | null;
  links: Links;
  page: Page;
}

export interface WorkPackageApiResponse {
  data: WorkPackageEntity;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}
export interface Page {
  size: number;
  totalObjects: number;
  totalPages: number;
  number: number;
}

export interface TableData<T> {
  entities: T[];
  page: Page;
}

export interface WorkPackageEntity {
  id?: string;
  name?: string;
  description?: string;
  owners?: (OwnersEntityOrApproversEntity)[] | null;
  approvers?: (OwnersEntityOrApproversEntity)[] | null;
  baseline?: (Baseline)[] | null;
  hasErrors?: boolean;
  status?: string;
  displayColour?: string;
  edit?: boolean;
  selected?: boolean;
  archived?: boolean;
}

export interface OwnersEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}

export interface WorkPackageEntitiesHttpParams {
  includeArchived?: boolean;
  ownerQuery?: string;
  textFilter?: string;
  page?: number;
  size?: number;
}

export interface WorkPackageApiRequest {
  data: WorkPackageEntity;
}

// Workpackage detail
export interface WorkPackageDetailApiResponse {
  data: WorkPackageDetail;
}
export interface WorkPackageDetail {
  id: string;
  name?: string;
  description?: string;
  objectives?: (ObjectivesEntityOrRadiosEntity)[] | null;
  radios?: (ObjectivesEntityOrRadiosEntity)[] | null;
  customPropertyValues?: (CustomPropertiesEntity)[] | null;
  owners?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
  baseline?: (Baseline)[] | null;
  approvers?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
  status?: string;
  availableActions?: AvailableActions;
  hasErrors?: boolean;
  changes?: Changes;
  archived?: boolean;
  displayColour?: string;
}
export interface AvailableActions {
  merge: boolean;
  reset: boolean;
  reject: boolean;
  submit: boolean;
  approve: boolean;
  supersede: boolean;
}
export interface ObjectivesEntityOrRadiosEntity {
  id: string;
  title: string;
  commentText: string;
  category: string;
  author: AuthorOrLastUpdatedBy;
  owners?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
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
  team?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
  email: string;
  phone: string;
  roles?: (RolesEntityOrLayout)[] | null;
}
export interface TeamEntityOrOwnersEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}
export interface RolesEntityOrLayout {
  id: string;
  name: string;
}
export interface CustomPropertiesEntity {
  propertyId?: string;
  name?: string;
  value: string;
}
export interface Baseline {
  id: string;
  name: string;
  description: string;
  owners?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
  approvers?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
  hasErrors: boolean;
  status: string;
}
export interface Changes {
  architectureItems: ArchitectureItems;
  architectureLinks: ArchitectureLinksOrAttributesOrReports;
  attributes: ArchitectureLinksOrAttributesOrReports;
  reports: ArchitectureLinksOrAttributesOrReports;
}
export interface ArchitectureItems {
  additions?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity)[] | null;
  updates?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity)[] | null;
  deletions?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity)[] | null;
}
export interface AdditionsEntityOrUpdatesEntityOrDeletionsEntity {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
  locations?: ((LocationsEntityEntity)[] | null)[] | null;
  owners?: (TeamEntityOrOwnersEntityOrApproversEntity)[] | null;
}
export interface LocationsEntityEntity {
  layout: RolesEntityOrLayout;
  locationCoordinates: string;
}
export interface ArchitectureLinksOrAttributesOrReports {
  additions?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity1)[] | null;
  updates?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity1)[] | null;
  deletions?: (AdditionsEntityOrUpdatesEntityOrDeletionsEntity1)[] | null;
}
export interface AdditionsEntityOrUpdatesEntityOrDeletionsEntity1 {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  sourceId: string;
  targetId: string;
  routes?: ((RoutesEntityEntity)[] | null)[] | null;
}
export interface RoutesEntityEntity {
  layout: RolesEntityOrLayout;
  points?: (number)[] | null;
}

export interface WorkpackageNode {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  tags: string;
}

export interface WorkpackageNodeDescendant {
  id: string;
}

export interface WorkpackageLink {
  id: string;
  layer: string;
  name: string;
  description: string;
  category: string;
  sourceId: string;
  targetId: string;
}

export interface WorkpackageLinkSliceAdd {
  id: string;
  orderNum: number;
}

export interface WorkpackageLinkSliceUpdate {
  id: string;
  name: string;
  description: string;
  orderNum: number;
}

export interface WorkpackageLinkSliceConditionType {
  id: string;
  name: string;
  orderNum: number;
}

export interface WorkpackageLinkSliceCondition {
  sliceId: string;
  conditionTypeId: string;
  value: string;
}

export interface WorkPackageNodeScopesApiResponse {
  data?: (WorkPackageNodeScopes)[] | null;
}

export interface WorkPackageNodeScopeApiResponse {
  data?: WorkPackageNodeScopes;
}

export interface WorkPackageNodeScopes {
  id: string;
  name: string;
  explicitlyIncluded: boolean;
  removeFromButton: boolean;
  availableForAddition: boolean;
}

export interface WorkPackageNodeFindPotential {
  childrenOf?: ChildrenOf;
}

interface ChildrenOf {
  id: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
}
