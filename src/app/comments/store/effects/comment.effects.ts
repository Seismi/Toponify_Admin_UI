import * as CommentActions from '../actions/comment.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AddCommentApiRequest,
  AddCommentApiResponse,
  AddReplyCommentApiRequest,
  AddReplyCommentApiResponse,
  ArchiveCommentApiRequest,
  ArchiveCommentApiResponse,
  CommentApiResponse
  } from '../models/comment.model';
import {
  catchError,
  map,
  mergeMap,
  switchMap
  } from 'rxjs/operators';
import { CommentActionTypes } from '../actions/comment.actions';
import { CommentService } from '../../services/comment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';


@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions,
    private commentService: CommentService
  ) { }

  @Effect()
  loadComments$ = this.actions$.pipe(
    ofType<CommentActions.LoadComments>(CommentActionTypes.LoadComments),
    map(action => action.payload),
    switchMap((versionId: string) => {
      return this.commentService.getComments(versionId).pipe(
        switchMap((response: CommentApiResponse) => [new CommentActions.LoadCommentSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new CommentActions.LoadCommentsFail(error)))
      );
    })
  );

  @Effect()
  loadReplyComments$ = this.actions$.pipe(
    ofType<CommentActions.LoadReplyComments>(CommentActionTypes.LoadReplyComments),
    map(action => action.payload),
    switchMap((payload: {versionId: string, commentId: string}) => {
      return this.commentService.getReplyComments(payload.versionId, payload.commentId).pipe(
        switchMap((response: any) => [new CommentActions.LoadReplyCommentsSuccess(response.data)]),
        catchError((error: HttpErrorResponse) => of(new CommentActions.LoadReplyCommentsFail(error)))
      );
    })
  );

  @Effect()
  addComment$ = this.actions$.pipe(
    ofType<CommentActions.AddComment>(CommentActionTypes.AddComment),
    map(action => action.payload),
    mergeMap((payload: {comment: AddCommentApiRequest, versionId: string}) => {
      return this.commentService.addComment(payload.comment, payload.versionId).pipe(
        mergeMap((comment: AddCommentApiResponse) => [new CommentActions.AddCommentSuccess(comment.data)]),
        catchError((error: HttpErrorResponse) => of(new CommentActions.AddCommentFail(error)))
      );
    })
  );

  @Effect()
  replyComment$ = this.actions$.pipe(
    ofType<CommentActions.ReplyComment>(CommentActionTypes.ReplyComment),
    map(action => action.payload),
    mergeMap((payload: {comment: AddReplyCommentApiRequest, versionId: string, commentId: string}) => {
      return this.commentService.addReplyComment(payload.comment, payload.versionId, payload.commentId).pipe(
        mergeMap((comment: AddReplyCommentApiResponse) => [new CommentActions.ReplyCommentSuccess(comment.data)]),
        catchError((error: HttpErrorResponse) => of(new CommentActions.ReplyCommentFail(error)))
      );
    })
  );

  @Effect()
  archiveComment$ = this.actions$.pipe(
    ofType<CommentActions.ArchiveComment>(CommentActionTypes.ArchiveComment),
    map(action => action.payload),
    mergeMap((payload: {comment: ArchiveCommentApiRequest, versionId: string, commentId: string}) => {
      return this.commentService.archiveComment(payload.comment, payload.versionId, payload.commentId).pipe(
        mergeMap((comment: ArchiveCommentApiResponse) => [new CommentActions.ArchiveCommentSuccess(comment.data)]),
        catchError((error: HttpErrorResponse) => of(new CommentActions.ArchiveCommentFail(error)))
      );
    })
  );
}
