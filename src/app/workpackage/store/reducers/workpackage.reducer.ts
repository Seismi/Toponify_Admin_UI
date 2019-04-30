import { HttpErrorResponse } from '@angular/common/http';
import { WorkPackageActionsUnion, WorkPackageActionTypes } from '../actions/workpackage.actions';
import { WorkPackageEntity, WorkPackageStatePage, WorkPackageStateLinks } from '../models/workpackage.models';

export interface State {
  entities: WorkPackageEntity[];
  page: WorkPackageStatePage;
  links: WorkPackageStateLinks;
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  entities: [],
  page: null,
  links: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: WorkPackageActionsUnion): State {
  switch (action.type) {

    case WorkPackageActionTypes.LoadWorkPackages: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesSuccess: {
      return {
        ...state,
        entities: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.AddWorkPackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.AddWorkPackageSuccess: {
      const addedEntity = action.payload;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case WorkPackageActionTypes.AddWorkPackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.UpdateWorkPackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.UpdateWorkPackageSuccess: {
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

    case WorkPackageActionTypes.UpdateWorkPackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackageSuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload),
        loading: false
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackageFailure: {
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

