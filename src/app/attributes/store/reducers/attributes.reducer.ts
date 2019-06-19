import { HttpErrorResponse } from '@angular/common/http';
import { AttributeActionsUnion, AttributeActionTypes } from '../actions/attributes.actions';
import { AttributeEntity, Page, Links, AttributeDetail } from '../models/attributes.model';

export interface State {
  entities: AttributeEntity[];
  page: Page;
  links: Links;
  loading: boolean;
  selectedAttribute: AttributeDetail;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  entities: [],
  page: null,
  links: null,
  loading: false,
  selectedAttribute: null,
  error: null
};

export function reducer(state = initialState, action: AttributeActionsUnion): State {
  switch (action.type) {

    case AttributeActionTypes.LoadAttributes: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.LoadAttributesSuccess: {
      return {
        ...state,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false
      };
    }

    case AttributeActionTypes.LoadAttributesFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }


    case AttributeActionTypes.LoadAttribute: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.LoadAttributeSuccess: {
      return {
        ...state,
        selectedAttribute: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.LoadAttributeFailure: {
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