import { CommentActionsUnion, CommentActionTypes } from '../actions/comment.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Comment } from '../models/comment.model';

export interface State {
  loading: boolean;
  comments: Comment[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  comments: [],
  error: null,
};

export function reducer(state = initialState, action: CommentActionsUnion): State {
  switch (action.type) {

    case CommentActionTypes.LoadComments: {
      return {
        ...state,
        loading: true,
      };
    }

     case CommentActionTypes.LoadCommentsSuccess: {
      return {
        loading: false,
        comments: action.payload
      };
    }

    case CommentActionTypes.LoadCommentFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case CommentActionTypes.LoadReplyComments: {
      return {
        ...state,
        loading: true,
      };
    }

     case CommentActionTypes.LoadReplyCommentsSuccess: {
      return {
        ...state,
        loading: false,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id
            ? { ...comment, ...action.payload }
            : comment
        )
      };
    }

    case CommentActionTypes.LoadReplyCommentsFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case CommentActionTypes.AddComment: {
      return {
        ...state,
        loading: true
      };
    }

    case CommentActionTypes.AddCommentSuccess: {
      return {
        ...state,
        loading: false,
        comments: [...state.comments, action.payload]
      };
    }

    case CommentActionTypes.AddCommentFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case CommentActionTypes.ReplyComment: {
      return {
        ...state,
        loading: true
      };
    }

    case CommentActionTypes.ReplyCommentSuccess: {
      return {
        ...state,
        loading: false,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id
            ? { ...comment, ...action.payload }
            : comment
        )
      };
    }

    case CommentActionTypes.ReplyCommentFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case CommentActionTypes.ArchiveComment: {
      return {
        ...state,
        loading: true
      };
    }

    case CommentActionTypes.ArchiveCommentSuccess: {
      return {
        ...state,
        loading: false,
        comments: [...state.comments, action.payload]
      };
    }

    case CommentActionTypes.ArchiveCommentFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getComments = (state: State) => state.comments;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
