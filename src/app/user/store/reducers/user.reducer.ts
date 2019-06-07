import { UserDetails, Page, Links, UserEntity } from '../models/user.model';
import { UserActionTypes, UserActionsUnion } from '../actions/user.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  loading: boolean;
  entities: UserEntity[];
  selected: UserDetails;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: null,
  selected: null,
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: UserActionsUnion): State {
  switch (action.type) {

    case UserActionTypes.LoadUsers: {
      return {
        ...initialState,
        loading: true
      };
    }

    case UserActionTypes.LoadUsersSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
      };
    }

    case UserActionTypes.LoadUsersFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case UserActionTypes.LoadUser: {
      return {
        ...initialState,
        loading: true
      };
    }

    case UserActionTypes.LoadUserSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload.data
      };
    }

    case UserActionTypes.LoadUserFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case UserActionTypes.AddUser: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.AddUserSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case UserActionTypes.AddUserFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case UserActionTypes.UpdateUser: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.UpdateUserSuccess: {
      const updatedEntity = action.payload.data;
      return {
        ...state,
        entities: state.entities.map(entity => {
          if (entity.id === updatedEntity.id) {
            return updatedEntity;
          }
          return entity;
        }),
        loading: false
      };
    }

    case UserActionTypes.UpdateUserFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case UserActionTypes.DeleteUser: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.DeleteUserSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case UserActionTypes.DeleteUserFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}
