export interface CommentApiResponse {
  data?: (Comment)[] | null;
}

export interface AddCommentApiResponse {
  data?: Comment | null;
}

export interface AddReplyCommentApiResponse {
  data?: Comment | null;
}

export interface ArchiveCommentApiResponse {
  data?: Comment | null;
}

export interface Comment {
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


export interface AddCommentApiRequest {
  data: AddComment;
}
export interface AddComment {
  title: string;
  category: string;
  status: string;
  commentText: string;
  author: AuthorOrLastUpdatedBy;
}

export interface AddReplyCommentApiRequest {
  data: AddReplyComment;
}
export interface AddReplyComment {
  replyText: string;
  author: AuthorOrLastUpdatedBy;
  changes?: Changes;
}

export interface ArchiveCommentApiRequest {
  data: ArchiveComment;
}
interface ArchiveComment {
  changes: Changes;
  replyText: string;
  author: AuthorOrLastUpdatedBy;
}
