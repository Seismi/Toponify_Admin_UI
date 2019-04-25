import { VersionActionsUnion, VersionActionTypes } from '../actions/version.actions';

import { HttpErrorResponse } from '@angular/common/http';
import { Version } from '../models/version.model';

export interface State {
  loading: boolean;
  versions: Version[];
  error?: HttpErrorResponse | { message: string };
  
}

export const initialState: State = {
  loading: false,
  versions: [],
  error: null,

};

export function reducer(state = initialState, action: VersionActionsUnion): State {
  switch (action.type) {

    case VersionActionTypes.LoadVersions: {
      return {
        ...initialState
      };
    }

    case VersionActionTypes.LoadVersionsSuccess: {
      return {
        ...state,
        loading: false,
        versions: action.payload,
        error: null
      };
    }

    case VersionActionTypes.LoadVersionsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.AddVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.AddVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: [...state.versions, action.payload]
      };
    }

    case VersionActionTypes.AddVersionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.UpdateVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.UpdateVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: state.versions.map(version =>
          version.id === action.payload.id
            ? { ...version, ...action.payload }
            : version
        )
      };
    }

    case VersionActionTypes.AddVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: [...state.versions, action.payload]
      };
    }

    case VersionActionTypes.AddVersionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.AddVersionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.DeleteVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.DeleteVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: state.versions.filter(version => action.payload !== version.id)
      };
    }

    case VersionActionTypes.DeleteVersionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.ArchiveVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.ArchiveVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: state.versions.map(version =>
          version.id === action.payload.id
            ? { ...version, ...action.payload }
            : version
        )
      };
    }

    case VersionActionTypes.ArchiveVersionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case VersionActionTypes.UnarchiveVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.UnarchiveVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: state.versions.map(version =>
          version.id === action.payload.id
            ? { ...version, ...action.payload }
            : version
        )
      };
    }

    case VersionActionTypes.CopyVersion: {
      return {
        ...state,
        loading: true
      };
    }

    case VersionActionTypes.CopyVersionSuccess: {
      return {
        ...state,
        loading: false,
        versions: [...state.versions, action.payload]
      };
    }

    case VersionActionTypes.CopyVersionFailure: {
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

export const getLoading = (state: State) => state.loading;
export const getVersions = (state: State) => state.versions;
export const getError = (state: State) => state.error;
