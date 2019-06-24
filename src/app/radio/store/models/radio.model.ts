export interface RadioEntitiesHttpParams {
  ownerQuery?: string;
  scopeQuery?: string;
  page?: string;
  size?: string;
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
  category: string;
  author: AuthorOrLastUpdatedBy;
  owners?: (TeamsOrOwners)[] | null;
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
  status: string;
  category: string;
  author: AuthorOrLastUpdatedBy;
  owners: (TeamsOrOwners)[] | null;
  createdOn: string;
  lastUpdatedOn: string;
  lastUpdatedBy: (AuthorOrLastUpdatedBy)[] | null;
  target?: (Target)[] | null;
  link?: (Link)[] | null;
  replyCount: number;
  replies?: (Replies)[] | null;
}

export interface Target {
  id: string;
  objectType: string;
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
  changes?: (Changes) | null;
  replies?: (string)[] | null;
}

export interface Changes {
  hasChanges: boolean;
  listChanges: (ListChanges)[] | null;
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
  author: AuthorOrLastUpdatedBy;
  replyText: string;
  changes: AddRadioOrReplyChanges;
}

interface AddRadioOrReplyChanges {
  title?: string;
  status?: string;
  category?: string;
  description?: string;
  author?: AuthorOrLastUpdatedBy;
}