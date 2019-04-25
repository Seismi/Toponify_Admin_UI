import { Action } from '@ngrx/store';
import { Comment, AddCommentApiRequest, AddReplyCommentApiRequest, ArchiveCommentApiRequest, Replies } from '../models/comment.model';
import { HttpErrorResponse } from '@angular/common/http';

export enum CommentActionTypes {
  LoadComments = '[Comments] Load Comments',
  LoadCommentsSuccess = '[Comments] Load Comments Success',
  LoadCommentFail = '[Comments] Load Comments Fail',
  LoadReplyComments = '[Comments] Load Reply Comments',
  LoadReplyCommentsSuccess = '[Comments] Load Reply Comments Success',
  LoadReplyCommentsFail = '[Comments] Load Reply Comments Fail',
  AddComment = '[Comments] Add Comment',
  AddCommentSuccess = '[Comments] Add Comment Success',
  AddCommentFail = '[Comments] Add Comment Fail',
  ReplyComment = '[Comments] Reply Comment',
  ReplyCommentSuccess = '[Comments] Reply Comment Success',
  ReplyCommentFail = '[Comments] Reply Comment Fail',
  ArchiveComment = '[Comments] Archive Comment',
  ArchiveCommentSuccess = '[Comments] Archive Comment Success',
  ArchiveCommentFail = '[Comments] Archive Comment Fail'
}

export class LoadComments implements Action {
  readonly type = CommentActionTypes.LoadComments;
  constructor(public payload: string) {}
}

export class LoadCommentSuccess implements Action {
  readonly type = CommentActionTypes.LoadCommentsSuccess;
  constructor(public payload: Comment[]) {}
}

export class LoadCommentsFail implements Action {
  readonly type = CommentActionTypes.LoadCommentFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class LoadReplyComments implements Action {
  readonly type = CommentActionTypes.LoadReplyComments;
  constructor(public payload: {versionId: string, commentId: string}) {}
}

export class LoadReplyCommentsSuccess implements Action {
  readonly type = CommentActionTypes.LoadReplyCommentsSuccess;
  constructor(public payload: Comment) {}
}

export class LoadReplyCommentsFail implements Action {
  readonly type = CommentActionTypes.LoadReplyCommentsFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class AddComment implements Action {
  readonly type = CommentActionTypes.AddComment;
  constructor(public payload: { comment: AddCommentApiRequest, versionId: string }) {}
}

export class AddCommentSuccess implements Action {
  readonly type = CommentActionTypes.AddCommentSuccess;
  constructor(public payload: Comment) {}
}

export class AddCommentFail implements Action {
  readonly type = CommentActionTypes.AddCommentFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ReplyComment implements Action {
  readonly type = CommentActionTypes.ReplyComment;
  constructor(public payload: { comment: AddReplyCommentApiRequest, versionId: string, commentId: string }) {}
}

export class ReplyCommentSuccess implements Action {
  readonly type = CommentActionTypes.ReplyCommentSuccess;
  constructor(public payload: Comment) {}
}

export class ReplyCommentFail implements Action {
  readonly type = CommentActionTypes.ReplyCommentFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export class ArchiveComment implements Action {
  readonly type = CommentActionTypes.ArchiveComment;
  constructor(public payload: { comment: ArchiveCommentApiRequest, versionId: string, commentId: string }) {}
}

export class ArchiveCommentSuccess implements Action {
  readonly type = CommentActionTypes.ArchiveCommentSuccess;
  constructor(public payload: any) {}
}

export class ArchiveCommentFail implements Action {
  readonly type = CommentActionTypes.ArchiveCommentFail;
  constructor(public payload: HttpErrorResponse | { message: string }) {}
}

export type CommentActionsUnion = 
  | LoadComments
  | LoadCommentSuccess
  | LoadCommentsFail
  | AddComment
  | AddCommentSuccess
  | AddCommentFail
  | ReplyComment
  | ReplyCommentSuccess
  | ReplyCommentFail
  | ArchiveComment
  | ArchiveCommentSuccess
  | ArchiveCommentFail
  | LoadReplyComments
  | LoadReplyCommentsSuccess
  | LoadReplyCommentsFail;


