import { SearchActionTypes, SearchActionsUnion } from '../actions/search.actions';
import { SearchEntity } from '../models/search.models';
import { HttpErrorResponse } from '@angular/common/http';

export interface State {
  entities: SearchEntity[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  entities: [],
  error: null
};

export function reducer(state = initialState, action: SearchActionsUnion): State {
  switch (action.type) {
    case SearchActionTypes.Search: {
      return {
        ...state
      };
    }

    case SearchActionTypes.SearchSuccess: {
      return {
        ...state,
        entities: action.payload.data
      };
    }

    case SearchActionTypes.SearchFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case SearchActionTypes.ClearSearch: {
      return {
        ...state,
        entities: []
      };
    }

    default: {
      return state;
    }
  }
}
