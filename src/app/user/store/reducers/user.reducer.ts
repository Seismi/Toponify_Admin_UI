import { UserActionsUnion, UserActionTypes } from '../actions/user.actions';
import { UserState } from './index';

export const initialState: UserState = {
  loading: false,
  users: [],
  error: null
};

export function reducer(state = initialState, action: UserActionsUnion): UserState {
  switch (action.type) {
    case UserActionTypes.LoadUsers: {
      return {
        ...initialState
      };
    }

    case UserActionTypes.LoadUsersSuccess: {
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    }

    case UserActionTypes.LoadUsersFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    
    case UserActionTypes.UpdateUser: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.UpdateUserSuccess: {
      return {
        ...state,
        loading: false,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload }
            : user
        )
      };
    }

    case UserActionTypes.AddUser: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.AddUserSuccess: {
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload]
      };
    }

    case UserActionTypes.AddUserFailure: {
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

export const getLoading = (state: UserState) => state.loading;
export const getUsers = (state: UserState) => state.users;
export const getError = (state: UserState) => state.error;
