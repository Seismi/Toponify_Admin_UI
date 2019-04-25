import { HttpErrorResponse } from '@angular/common/http';
import { SystemLink } from '../models/system-links.model';
import { SystemLinkActionTypes, SystemLinkActionsUnion } from '../actions/system-link.actions';
import { VersionLinkActionsUnion } from '../actions/link.actions';


export interface State {
  systemLinks: SystemLink[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  systemLinks: null,
  loading: false
};

export function reducer(state = initialState, action: SystemLinkActionsUnion | VersionLinkActionsUnion): State {
  switch (action.type) {

    case SystemLinkActionTypes.LoadSystemLinks: {
      return {
        ...initialState,
        loading: true
      };
    }

    case SystemLinkActionTypes.LoadSystemLinksSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        systemLinks: action.payload
      };
    }

    case SystemLinkActionTypes.LoadSystemLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case SystemLinkActionTypes.AddSystemLinks: {
      return {
        ...state,
        loading: true
      };
    }

    case SystemLinkActionTypes.AddSystemLinksSuccess: {
      return {
        ...state,
        loading: false,
        systemLinks: [...state.systemLinks, action.payload]
      };
    }

    case SystemLinkActionTypes.AddSystemLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case SystemLinkActionTypes.UpdateSystemLinks: {
      return {
        ...state,
        loading: true
      };
    }

    case SystemLinkActionTypes.UpdateSystemLinksSuccess: {
      const links = action.payload;
      return {
        ...state,
        loading: false,
        systemLinks: state.systemLinks.map(link => {
          if (links[link.id]) {
            return { ...link, ...links[link.id] };
          }
          return link;
        })
      };
    }

    case SystemLinkActionTypes.UpdateSystemLinksFailure: {
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

export const getSystem = (state: State) => state.systemLinks;
export const getSystemLinks = (state: State) => state.systemLinks;

