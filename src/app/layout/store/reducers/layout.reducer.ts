import { LayoutDetails, Page, Links, LayoutEntity } from '../models/layout.model';
import { LayoutActionTypes, LayoutActionsUnion } from '../actions/layout.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  loading: boolean;
  entities: LayoutEntity[];
  selected: LayoutDetails;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: [],
  selected: null,
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: LayoutActionsUnion): State {
  switch (action.type) {

    case LayoutActionTypes.LoadLayouts: {
      return {
        ...initialState,
        loading: true
      };
    }

    case LayoutActionTypes.LoadLayoutsSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
      };
    }

    case LayoutActionTypes.LoadLayoutFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case LayoutActionTypes.LoadLayout: {
      return {
        ...state,
        loading: true
      };
    }

    case LayoutActionTypes.LoadLayoutSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload.data
      };
    }

    case LayoutActionTypes.LoadLayoutFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case LayoutActionTypes.AddLayout: {
      return {
        ...state,
        loading: true
      };
    }

    case LayoutActionTypes.AddLayoutSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case LayoutActionTypes.AddLayoutFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case LayoutActionTypes.UpdateLayout: {
      return {
        ...state,
        loading: true
      };
    }

    case LayoutActionTypes.UpdateLayoutSuccess: {
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

    case LayoutActionTypes.UpdateLayoutFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case LayoutActionTypes.DeleteLayout: {
      return {
        ...state,
        loading: true
      };
    }

    case LayoutActionTypes.DeleteLayoutSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case LayoutActionTypes.DeleteLayoutFailure: {
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
