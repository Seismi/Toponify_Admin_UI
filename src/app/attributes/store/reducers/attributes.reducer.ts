import { HttpErrorResponse } from '@angular/common/http';
import { AttributeActionsUnion, AttributeActionTypes } from '../actions/attributes.actions';
import { Attribute } from '../models/attributes.model';

export interface State {
  attributes: Attribute[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  attributes: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: AttributeActionsUnion): State {
  switch (action.type) {

    case AttributeActionTypes.LoadAttributes: {
      return {
        ...initialState,
        loading: true
      };
    }

    case AttributeActionTypes.LoadAttributesSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        attributes: action.payload
      };
    }

    case AttributeActionTypes.LoadAttributesFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case AttributeActionTypes.UpdateAttribute: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.UpdateAttributeSuccess: {
      return {
        ...state,
        loading: false,
        attributes: state.attributes.map(attribute =>
          attribute.id === action.payload.id
            ? { ...attribute, ...action.payload }
            : attribute
        )
      };
    }

    case AttributeActionTypes.UpdateAttributeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }


   case AttributeActionTypes.DeleteAttribute: {
        return {
        ...state,
        loading: true
        }
    };
      
    case AttributeActionTypes.DeleteAttributeSuccess: {
      return {
        ...state,
        loading: false,
        attributes: state.attributes.filter((attribute) => attribute.id !== action.payload)
      };
    }

    case AttributeActionTypes.DeleteAttributeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }
     
    case AttributeActionTypes.AddAttribute: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.AddAttributeSuccess: {
      return {
        ...state,
        loading: false,
        attributes: [...state.attributes, action.payload]
      };
    }

    case AttributeActionTypes.AddAttributeFailure: {
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