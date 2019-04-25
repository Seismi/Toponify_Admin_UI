import { HttpErrorResponse } from '@angular/common/http';
import { DimensionLink } from '../models/dimension-link.model';
import { DimensionLinkActionsUnion, DimensionLinkActionTypes } from '../actions/dimension-link.actions';

export interface State {
  dimensionLinks: DimensionLink[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  dimensionLinks: null,
  loading: false
};

export function reducer(state = initialState, action: DimensionLinkActionsUnion): State {
  switch (action.type) {

    case DimensionLinkActionTypes.LoadDimensionLinks: {
      return {
        ...initialState,
        loading: true
      };
    }

    case DimensionLinkActionTypes.LoadDimensionLinksSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        dimensionLinks: action.payload
      };
    }

    case DimensionLinkActionTypes.LoadDimensionLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionLinkActionTypes.AddDimensionLink: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionLinkActionTypes.AddDimensionLinkSuccess: {
      return {
        ...state,
        loading: false,
        dimensionLinks: [...state.dimensionLinks, action.payload]
      };
    }

    case DimensionLinkActionTypes.AddDimensionLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionLinkActionTypes.UpdateDimensionLink: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionLinkActionTypes.UpdateDimensionLinkSuccess: {

      const links = action.payload;

      return {
        ...state,
        loading: false,
        dimensionLinks: state.dimensionLinks.map(link => {
          if (links[link.id]) {
            return { ...link, ...links[link.id] };
          }
          return link;
        })
      };
    }

    case DimensionLinkActionTypes.UpdateDimensionLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionLinkActionTypes.DeleteDimensionLink: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionLinkActionTypes.DeleteDimensionLinkSuccess: {
      return {
        ...state,
        loading: false,
        dimensionLinks: state.dimensionLinks.filter((dimensionLink) => dimensionLink.id !== action.payload)
      };
    }

    case DimensionLinkActionTypes.DeleteDimensionLinkFailure: {
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

