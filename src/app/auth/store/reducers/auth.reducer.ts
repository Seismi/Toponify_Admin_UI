import { HttpErrorResponse } from '@angular/common/http';
import { AuthActionsUnion, AuthActionTypes } from './../actions/auth.actions';
import { User } from '../models/user.model';

export interface State {
  loggedIn: boolean;
  user?: User;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loggedIn: false,
  user: null,
  error: null
};

export function reducer(state = initialState, action: AuthActionsUnion): State {
  switch (action.type) {
    case AuthActionTypes.Login: {
      return {
        ...initialState,
        user: {
          username: action.payload.username
        }
      };
    }

    case AuthActionTypes.LoginSuccess: {
      return {
        ...state,
        loggedIn: true,
        error: null
      };
    }

    case AuthActionTypes.LoginFailure: {
      return {
        ...initialState,
        error: action.payload
      };
    }

    case AuthActionTypes.Logout:
     {
      return initialState;
    }

    default: {
      return state;
    }
  }
}

export const getLoggedIn = (state: State) => state.loggedIn;
export const getUser = (state: State) => state.user;
export const getError = (state: State) => state.error;
