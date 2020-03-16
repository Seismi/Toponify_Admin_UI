export interface RadioEntitiesHttpParams {
  ownerQuery?: string;
  scopeQuery?: string;
  page?: string;
  size?: string;
  format?: string;
}

export interface RadioEntitiesResponse {
  data?: (RadioEntity)[] | null;
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
  totalObjects: number;
  totalPages: number;
  number: number;
}

export interface RadioApiResponse {
  data?: RadioEntity;
}

export interface RadioApiRequest {
  data: AddRadioOrReplyChanges;
}

export interface RadioEntity {
  id: string;
  title: string;
  description: string;
  mitigation: string;
  category: string;
  author: AuthorOrLastUpdatedBy;
  owners?: (TeamsOrOwners)[] | null;
  assignedTo: AuthorOrLastUpdatedBy;
  actionBy: string;
  status: string;
  createdOn?: string;
  lastUpdatedOn?: string;
  lastUpdatedBy?: (AuthorOrLastUpdatedBy)[] | null;
  replyCount?: number;
}

export interface AuthorOrLastUpdatedBy {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface TeamsOrOwners {
  id: string;
  name: string;
  type: string;
}

export interface Roles {
  id: string;
  name: string;
}

// RADIO detail
export interface RadioDetailApiResponse {
  data: RadioDetail;
}
export interface RadioDetail {
  id: string;
  title: string;
  description: string;
  mitigation: string;
  status: string;
  category: string;
  reference: string;
  assignedTo: AssignedTo;
  actionBy: string;
  author: AuthorOrLastUpdatedBy;
  owners: (TeamsOrOwners)[] | null;
  createdOn: string;
  lastUpdatedOn: string;
  lastUpdatedBy: (AuthorOrLastUpdatedBy)[] | null;
  target?: (Target)[] | null;
  link?: (Link)[] | null;
  replyCount: number;
  replies?: (Replies)[] | null;
  relatesTo: (RelatesTo)[] | null;
  severity: number;
  frequency: number;
}

export interface RelatesTo {
  workPackage: WorkPackage;
  item?: Item;
}

interface WorkPackage {
  id: string;
  name?: string;
}

interface Item {
  id: string;
  itemType?: string;
  name?: string;
}

export interface AssignedTo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Target {
  id: string;
  objectType?: string;
}

export interface Link {
  id: string;
  title: string;
  description: string;
}

export interface Replies {
  id: string;
  author?: (AuthorOrLastUpdatedBy)[] | null;
  postedOn: string;
  replyText: string;
  changes?: Changes;
  replies?: (string)[] | null;
}

export interface Changes {
  hasChanges?: boolean;
  listChanges?: (ListChanges)[] | null;
}

export interface ListChanges {
  changedProperty: string;
  changedFrom: string;
  changedTo: string;
}

// Reply
export interface ReplyApiRequest {
  data: Reply;
}

export interface ReplyApiResponse {
  data: Reply;
}

export interface Reply {
  id?: string;
  replyText: string;
  changes: AddRadioOrReplyChanges;
}

interface AddRadioOrReplyChanges {
  title?: string;
  status?: string;
  category?: string;
  description?: string;
  assignedTo?: AssignedTo;
  author?: AuthorOrLastUpdatedBy;
  relatesTo?: (RelatesTo)[] | null;
  actionBy?: string;
  mitigation?: string;
}

// RADIO advanced search
export interface AdvancedSearchApiRequest {
  data: RadiosAdvancedSearch;
}

export interface RadiosAdvancedSearch {
  raisedByMe?: RaisedByMe;
  assignedToMe?: AssignedToMe;
  status?: Status;
  type?: Type;
  raisedBy?: RaisedBy;
  assignedTo?: AssignedToValues;
  workpackages?: WorkPackages;
  relatesTo?: RelatesToValues;
  dueDate?: DueDate;
  text?: Text;
}

interface Text {
  enabled: boolean;
  value: string;
}

interface DueDate {
  enabled?: boolean;
  from?: string;
  to?: string;
}

interface RelatesToValues {
  enabled: boolean;
  includeDescendants: boolean;
  includeLinks: boolean;
  values: (Values)[] | null;
}

interface WorkPackages {
  enabled: boolean;
  includeBaseline: boolean;
  values: (Values)[] | null;
}

interface AssignedToValues {
  enabled: boolean;
  values: (Values)[] | null;
}

interface RaisedBy {
  enabled: boolean;
  values: (Values)[] | null;
}

interface Values {
  id: string;
  objectType?: string;
  name?: string;
}

interface Type {
  enabled?: boolean;
  values: (string)[] | null;
}

interface Status {
  enabled?: boolean;
  values: (string)[] | null;
}

interface AssignedToMe {
  enabled: boolean;
}

interface RaisedByMe {
  enabled: boolean;
}
