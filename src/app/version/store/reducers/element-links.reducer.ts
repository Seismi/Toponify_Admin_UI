import { HttpErrorResponse } from '@angular/common/http';
import { ElementLink } from '../models/element-link.model';
import { ElementLinkActionsUnion, ElementLinkActionTypes } from '../actions/element-link.actions';

export interface State {
  elementLinks: ElementLink[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  elementLinks: null,
  loading: false
};

export function reducer(state = initialState, action: ElementLinkActionsUnion): State {
  switch (action.type) {

    case ElementLinkActionTypes.LoadElementLinks: {
      return {
        ...initialState,
        loading: true
      };
    }

    case ElementLinkActionTypes.LoadElementLinksSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        elementLinks: action.payload
      };
    }

    case ElementLinkActionTypes.LoadElementLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementLinkActionTypes.AddElementLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementLinkActionTypes.AddElementLinkSuccess: {
      return {
        ...state,
        loading: false,
        elementLinks: [...state.elementLinks, action.payload]
      };
    }

    case ElementLinkActionTypes.AddElementLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementLinkActionTypes.UpdateElementLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementLinkActionTypes.UpdateElementLinkSuccess: {

      const links = action.payload;

      return {
        ...state,
        loading: false,
        elementLinks: state.elementLinks.map(link => {
          if (links[link.id]) {
            return { ...link, ...links[link.id] };
          }
          return link;
        })
      };
    }

    case ElementLinkActionTypes.UpdateElementLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementLinkActionTypes.DeleteElementLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementLinkActionTypes.DeleteElementLinkSuccess: {
      return {
        ...state,
        loading: false,
        elementLinks: state.elementLinks.filter((elementLink) => elementLink.id !== action.payload)
      };
    }

    case ElementLinkActionTypes.DeleteElementLinkFailure: {
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

