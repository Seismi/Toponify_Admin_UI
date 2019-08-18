import { HttpErrorResponse } from '@angular/common/http';
import { WorkPackageActionsUnion, WorkPackageActionTypes } from '../actions/workpackage.actions';
import { WorkPackageEntity, Page, Links, WorkPackageDetail } from '../models/workpackage.models';

export interface State {
  entities: WorkPackageEntity[];
  page: Page;
  links: Links;
  loading: boolean;
  selectedWorkPackage: WorkPackageDetail;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  entities: [],
  page: null,
  links: null,
  loading: false,
  selectedWorkPackage: null,
  error: null
};

export function reducer(state = initialState, action: WorkPackageActionsUnion): State {
  switch (action.type) {

    case WorkPackageActionTypes.SetWorkpackageEditMode: {
      const { id } = action.payload;
      return {
        ...state,
        entities: state.entities.map(item => {
          if (item.id === id) {
            return {
              ...item,
              selected: !item.selected && !item.edit ? true : item.selected,
              edit: !item.edit
            };
          } else {
            return {
              ...item,
              edit: false
            };
          }
        })
      };
    }


    case WorkPackageActionTypes.SetWorkpackageDisplayColour: {
      const { workpackageId, colour} = action.payload;
      return {
        ...state,
        entities: state.entities.map(item => {
          if (item.id === workpackageId) {
            return {
              ...item,
              displayColour: colour
            };
          }
          return item;
        })
      };
    }

    case WorkPackageActionTypes.SetWorkpackageSelected: {
      const { workpackageId } = action.payload;
      return {
        ...state,
        entities: state.entities.map(item => {
          if (item.id === workpackageId) {
            return {
              ...item,
              selected: !item.selected
            };
          }
          return item;
        })
      };
    }

    case WorkPackageActionTypes.LoadWorkPackages: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesSuccess: {
      return {
        ...state,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
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

    case WorkPackageActionTypes.LoadWorkPackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageFailure: {
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

export const getWorkPackageEntities = (state: State) => state.entities;
export const getError = (state: State) => state.error;
