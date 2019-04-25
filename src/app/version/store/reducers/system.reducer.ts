import { HttpErrorResponse } from '@angular/common/http';
import { System } from '../models/system.model';
import { VersionSystemActionsUnion, VersionSystemActionTypes } from '../actions/version-system.actions';


export interface State {
  systems: System[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  systems: null,
  loading: false
};

export function reducer(state = initialState, action: VersionSystemActionsUnion): State {
  switch (action.type) {

    case VersionSystemActionTypes.LoadVersionSystems: {
      return {
        ...initialState,
        loading: true
      };
    }

    case VersionSystemActionTypes.LoadVersionSystemsSuccess: {
      return {
        ...state,
        loading: false,
        systems: action.payload
      };
    }

    case VersionSystemActionTypes.LoadVersionSystemsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionSystemActionTypes.AddVersionSystem: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionSystemActionTypes.AddVersionSystemSuccess: {
      return {
        ...state,
        loading: false,
        systems: [...state.systems, action.payload]
      };
    }

    case VersionSystemActionTypes.AddVersionSystemFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionSystemActionTypes.UpdateVersionSystem: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionSystemActionTypes.UpdateVersionSystemSuccess: {
      return {
        ...state,
        loading: false,
        systems: state.systems.map(system =>
          system.id === action.payload.id
            ? { ...system, ...action.payload }
            : system
        )
      };
    }

    case VersionSystemActionTypes.UpdateVersionSystemFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionSystemActionTypes.DeleteVersionSystem: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionSystemActionTypes.DeleteVersionSystemSuccess: {
      return {
        ...state,
        loading: false
      };
    }

    case VersionSystemActionTypes.DeleteVersionSystemFailure: {
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

export const getSystem = (state: State) => state.systems;

