import { RadioActionsUnion, RadioActionTypes } from '../actions/radio.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { RadioEntity, Page, Links, RadioDetail, Reply } from '../models/radio.model';

export interface State {
  entities: RadioEntity[];
  page: Page;
  links: Links;
  loading: boolean;
  selectedRadio: RadioDetail;
  reply: Reply[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  entities: [],
  page: null,
  links: null,
  loading: false,
  selectedRadio: null,
  reply: [],
  error: null
};

export function reducer(state = initialState, action: RadioActionsUnion): State {
  switch (action.type) {

    case RadioActionTypes.LoadRadios: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.LoadRadiosSuccess: {
      return {
        ...state,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false,
      };
    }

    case RadioActionTypes.LoadRadiosFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }


    case RadioActionTypes.LoadRadio: {
      return {
        ...state,
        loading: true
      };
    }

     case RadioActionTypes.LoadRadioSuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.LoadRadioFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }


    case RadioActionTypes.AddRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.AddRadioSuccess: {
      const addedEntity = action.payload;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case RadioActionTypes.AddRadioFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case RadioActionTypes.AddReply: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.AddReplySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload,
        entities: state.entities.map(entity =>
          entity.id === action.payload.id
            ? { ...entity, ...action.payload }
            : entity
        )
      };
    }

    case RadioActionTypes.AddReplyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case RadioActionTypes.UpdateRadioProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.UpdateRadioPropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.UpdateRadioPropertyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case RadioActionTypes.DeleteRadioProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.DeleteRadioPropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.DeleteRadioPropertyFailure: {
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