import { ErrorActionsUnion, ErrorActionTypes } from '@app/core/store/actions/error.actions';

export interface ErrorState {
  error: string;
}

export const initialState: ErrorState = {
  error: null
};

export function reducer(state = initialState, action: ErrorActionsUnion): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.ShowError:
      return {
        error: action.payload
      };

    default: {
      return state;
    }
  }
}
