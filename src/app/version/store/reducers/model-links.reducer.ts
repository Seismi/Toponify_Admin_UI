import { HttpErrorResponse } from '@angular/common/http';
import { ModelLinkActionsUnion, ModelLinkActionTypes } from '../actions/model-link.actions';
import { ModelLink } from '../models/model-links.model';


export interface State {
  modelLinks: ModelLink[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  modelLinks: null,
  loading: false
};

export function reducer(state = initialState, action: ModelLinkActionsUnion): State {
  switch (action.type) {

    case ModelLinkActionTypes.LoadModelLinks: {
      return {
        ...initialState,
        loading: true
      };
    }

    case ModelLinkActionTypes.LoadModelLinksSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        modelLinks: action.payload
      };
    }

    case ModelLinkActionTypes.LoadModelLinksFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelLinkActionTypes.AddModelLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelLinkActionTypes.AddModelLinkSuccess: {
      return {
        ...state,
        loading: false,
        modelLinks: [...state.modelLinks, action.payload]
      };
    }

    case ModelLinkActionTypes.AddModelLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelLinkActionTypes.UpdateModelLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelLinkActionTypes.UpdateModelLinkSuccess: {

      const links = action.payload;

      return {
        ...state,
        loading: false,
        modelLinks: state.modelLinks.map(link => {
          if (links[link.id]) {
            return { ...link, ...links[link.id] };
          }
          return link;
        })
      };

    }

    case ModelLinkActionTypes.UpdateModelLinkFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelLinkActionTypes.DeleteModelLink: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelLinkActionTypes.DeleteModelLinkSuccess: {
      return {
        ...state,
        loading: false,
        modelLinks: state.modelLinks.filter((modelLink) => modelLink.id !== action.payload )
      };

    }

    case ModelLinkActionTypes.UpdateModelLinkFailure: {
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

