import { HttpErrorResponse } from '@angular/common/http';
import { ElementActionsUnion, ElementActionTypes } from '../actions/element.actions';
import { Element } from '../models/element.model';

export interface State {
  elements: Element[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  elements: null,
  loading: false
};

export function reducer(state = initialState, action: ElementActionsUnion): State {
  switch (action.type) {

    case ElementActionTypes.LoadElements: {
      return {
        ...initialState,
        loading: true
      };
    }

    case ElementActionTypes.LoadElementsSuccess: {
      return {
        ...state,
        loading: false,
        elements: action.payload
      };
    }

    case ElementActionTypes.LoadElementsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementActionTypes.AddElement: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementActionTypes.AddElementSuccess: {
      return {
        ...state,
        loading: false,
        elements: [...state.elements, action.payload]
      };
    }

    case ElementActionTypes.AddElementFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementActionTypes.UpdateElement: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementActionTypes.UpdateElementSuccess: {
      return {
        ...state,
        loading: false,
        elements: state.elements.map(element =>
          element.id === action.payload.id
            ? { ...element, ...action.payload }
            : element
        )
      };
    }

    case ElementActionTypes.UpdateElementFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ElementActionTypes.DeleteElement: {
      return {
        ...state,
        loading: true
      };
    }

    case ElementActionTypes.DeleteElementSuccess: {
      return {
        ...state,
        loading: false,
        elements: state.elements.filter((element) => element.id !== action.payload)
      };
    }

    case ElementActionTypes.DeleteElementFailure: {
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

