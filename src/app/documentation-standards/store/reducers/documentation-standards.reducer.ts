
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentStandard, Page, Links } from '../models/documentation-standards.model';
import { DocumentationStandardActionsUnion, DocumentationStandardActionTypes } from '../actions/documentation-standards.actions';

export interface State {
  loading: boolean;
  entities: DocumentStandard[];
  selected: DocumentStandard;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: null,
  selected: null,
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: DocumentationStandardActionsUnion): State {
  switch (action.type) {

    case DocumentationStandardActionTypes.LoadDocumentationStandards: {
      return {
        ...initialState,
        loading: true
      };
    }

    case DocumentationStandardActionTypes.LoadDocumentationStandardsSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
      };
    }

    case DocumentationStandardActionTypes.LoadDocumentationStandard:
    case DocumentationStandardActionTypes.AddDocumentationStandard:
    case DocumentationStandardActionTypes.UpdateDocumentationStandard:
    case DocumentationStandardActionTypes.DeleteDocumentationStandard: {
      return {
        ...state,
        loading: true
      };
    }

    case DocumentationStandardActionTypes.LoadDocumentationStandardSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload.data
      };
    }

    case DocumentationStandardActionTypes.AddDocumentationStandardSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case DocumentationStandardActionTypes.UpdateDocumentationStandardSuccess: {
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

    case DocumentationStandardActionTypes.DeleteDocumentationStandardSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case DocumentationStandardActionTypes.UpdateDocumentationStandardFailure:
    case DocumentationStandardActionTypes.DeleteDocumentationStandardFailure:
    case DocumentationStandardActionTypes.AddDocumentationStandardFailure:
    case DocumentationStandardActionTypes.LoadDocumentationStandardFailure:
    case DocumentationStandardActionTypes.LoadDocumentationStandardsFailure:  {
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
