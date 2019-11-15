import { ScopeDetails, Page, Links, ScopeEntity } from '../models/scope.model';
import { ScopeActionTypes, ScopeActionsUnion } from '../actions/scope.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  loading: boolean;
  entities: ScopeEntity[];
  selected: ScopeDetails;
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

export function reducer(state = initialState, action: ScopeActionsUnion): State {
  switch (action.type) {

    case ScopeActionTypes.LoadScopes: {
      return {
        ...initialState,
        loading: true
      };
    }

    case ScopeActionTypes.LoadScopesSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
      };
    }

    case ScopeActionTypes.LoadScopesFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ScopeActionTypes.LoadScope: {
      return {
        ...state,
        loading: true
      };
    }

    case ScopeActionTypes.LoadScopeSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload.data
      };
    }

    case ScopeActionTypes.LoadScopeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ScopeActionTypes.AddScope: {
      return {
        ...state,
        loading: true
      };
    }

    case ScopeActionTypes.AddScopeSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case ScopeActionTypes.AddScopeFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case ScopeActionTypes.UpdateScope: {
      return {
        ...state,
        loading: true
      };
    }

    case ScopeActionTypes.UpdateScopeSuccess: {
      const updatedEntity = action.payload.data;
      return {
        ...state,
        selected: action.payload.data,
        entities: state.entities.map(entity => {
          if (entity.id === updatedEntity.id) {
            return updatedEntity;
          }
          return entity;
        }),
        loading: false
      };
    }

    case ScopeActionTypes.UpdateScopeFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case ScopeActionTypes.DeleteScope: {
      return {
        ...state,
        loading: true
      };
    }

    case ScopeActionTypes.DeleteScopeSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case ScopeActionTypes.DeleteScopeFailure: {
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