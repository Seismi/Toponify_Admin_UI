import * as fromComment from '../reducer/comment.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Comment } from '../models/comment.model';

export interface CommentState {
  loading: boolean;
  comments: Comment[];
}

export const getCommentState = createFeatureSelector<CommentState>('commentFeature');

export const getComments = createSelector(
  getCommentState,
  fromComment.getComments
);

export const getLoading = createSelector(
  getCommentState,
  fromComment.getLoading
);

export const getCommentsError = createSelector(
  getCommentState,
  fromComment.getError
);

export const getCommentById = (commentId: string) => {
  return createSelector(
    getCommentState,
    state => {
      return state.comments.filter(comment => comment.id === commentId);
    }
  );
}

