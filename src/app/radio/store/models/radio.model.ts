export interface RadioApiResponse {
  data?: (Radio)[] | null;
}

export interface AddRadioApiResponse {
  data?: Radio | null;
}

export interface AddReplyRadioApiResponse {
  data?: Radio | null;
}

export interface ArchiveRadioApiResponse {
  data?: Radio | null;
}

export interface Radio {
  id: string;
  title: string;
  commentText: string;
  category: string;
  author: AuthorOrLastUpdatedBy;
  status: string;
  createdOn: string;
  lastUpdatedOn: string;
  lastUpdatedBy: AuthorOrLastUpdatedBy;
  replyCount: number;
  replies: Replies;
  replyText: string;
}

export interface Replies {
  id: string;
  replyText: string;
  changes: Changes;
  author: AuthorOrLastUpdatedBy;
  postedOn: string;
}

export interface AuthorOrLastUpdatedBy {
  userId: string;
  firstName?: string;
  lastName?: string;
  team?: (string)[] | null;
}

export interface Changes {
  title?: string;
  commentText?: string;
  category?: string;
  status?: string;
  target?: Target;
}

export interface Target {
  id: string;
  objectType: string;
}

export interface AddRadioApiRequest {
  data: AddRadio;
}
export interface AddRadio {
  title: string;
  category: string;
  status: string;
  commentText: string;
  author: AuthorOrLastUpdatedBy;
}

export interface AddReplyRadioApiRequest {
  data: AddReplyRadio;
}
export interface AddReplyRadio {
  replyText: string;
  author: AuthorOrLastUpdatedBy;
  changes?: Changes;
}

export interface ArchiveRadioApiRequest {
  data: ArchiveRadio;
}
interface ArchiveRadio {
  changes: Changes;
  replyText: string;
  author: AuthorOrLastUpdatedBy;
}
