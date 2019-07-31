import { User, RolesEntity} from '../models/user.model';
import { UserActionTypes, UserActionsUnion } from '../actions/user.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  loading: boolean;
  entities: User[];
  roles: RolesEntity[];
  selected: User;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: null,
  selected: null,
  error: null,
  roles: []
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
      };
    }

    case UserActionTypes.LoadUserRolesFailure:
    case UserActionTypes.LoadUsersFailure:
    case UserActionTypes.LoadUserFailure:
    case UserActionTypes.DeleteUserFailure:  {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case UserActionTypes.LoadUser:
    case UserActionTypes.AddUser:
    case UserActionTypes.UpdateUser:
    case UserActionTypes.DeleteUser:  {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.LoadUserSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload
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

    case UserActionTypes.AddUserFailure:
    case UserActionTypes.UpdateUserFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case UserActionTypes.UpdateUserSuccess: {
      const updatedEntity = action.payload;
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


    case UserActionTypes.DeleteUserSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case UserActionTypes.LoadUserRoles: {
      return {
        ...state,
        loading: true
      };
    }

    case UserActionTypes.LoadUserRolesSuccess: {
      return {
        ...state,
        loading: false,
        roles: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
