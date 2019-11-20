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
        entities: [...state.entities, action.payload]
      };
    }

    case AttributeActionTypes.AddAttributeFailure: {
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
      const updatedEntity = action.payload;
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
        selectedAttribute: action.payload,
        entities: state.entities.filter(entity => {
          if (entity.id === state.selectedAttribute.id) {
            return action.payload
          }
          return entity
        }),
      };
    }

    case AttributeActionTypes.DeleteAttributeFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case AttributeActionTypes.AddOwner: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.AddOwnerSuccess: {
      return {
        ...state,
        selectedAttribute: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        }),
        loading: false
      };
    }

    case AttributeActionTypes.AddOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.DeleteOwner: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.DeleteOwnerSuccess: {
      return {
        ...state,
        loading: false,
        selectedAttribute: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case AttributeActionTypes.DeleteOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.UpdateProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.UpdatePropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedAttribute: action.payload
      };
    }

    case AttributeActionTypes.UpdatePropertyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.DeleteProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.DeletePropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedAttribute: action.payload
      };
    }

    case AttributeActionTypes.DeletePropertyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.AddRelated: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.AddRelatedSuccess: {
      return {
        ...state,
        selectedAttribute: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        }),
        loading: false
      };
    }

    case AttributeActionTypes.AddRelatedFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case AttributeActionTypes.DeleteRelated: {
      return {
        ...state,
        loading: true
      };
    }

    case AttributeActionTypes.DeleteRelatedSuccess: {
      return {
        ...state,
        loading: false,
        selectedAttribute: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case AttributeActionTypes.DeleteRelatedFailure: {
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