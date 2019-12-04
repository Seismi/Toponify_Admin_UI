import { HttpErrorResponse } from '@angular/common/http';
import { WorkPackageActionsUnion, WorkPackageActionTypes } from '../actions/workpackage.actions';
import { Links, Page, WorkPackageDetail, WorkPackageEntity } from '../models/workpackage.models';

export interface State {
  editId: string;
  entities: WorkPackageEntity[];
  avaialabilities: any[];
  page: Page;
  links: Links;
  loading: boolean;
  selectedWorkPackage: WorkPackageDetail;
  selectedWorkPackageIds: string[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  editId: null,
  entities: [],
  avaialabilities: [],
  page: null,
  links: null,
  loading: false,
  selectedWorkPackage: null,
  selectedWorkPackageIds: [],
  error: null
};

export function reducer(state = initialState, action: WorkPackageActionsUnion): State {
  switch (action.type) {
    case WorkPackageActionTypes.SetWorkpackageEditMode: {
      const { id, newState } = action.payload;
      return {
        ...state,
        editId: newState ? id : null
      };
    }

    case WorkPackageActionTypes.SetWorkpackageDisplayColour: {
      const { workpackageId, colour } = action.payload;
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

    case WorkPackageActionTypes.SetSelectedWorkPackages: {
      const { workPackages } = action.payload;
      let resetEdit = true;
      if (state.editId && workPackages.length === 1 && workPackages[0] === state.editId) {
        resetEdit = false;
      }
      return {
        ...state,
        selectedWorkPackageIds: [...workPackages],
        editId: resetEdit ? null : state.editId
      };
    }

    case WorkPackageActionTypes.GetWorkpackageAvailability: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.GetWorkpackageAvailabilitySuccess: {
      return {
        ...state,
        avaialabilities: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.GetWorkpackageAvailabilityFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
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

    case WorkPackageActionTypes.AddOwner: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.AddOwnerSuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        }),
        loading: false
      };
    }

    case WorkPackageActionTypes.AddOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.DeleteOwner: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.DeleteOwnerSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.DeleteOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.AddObjective: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.AddObjectiveSuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload
      };
    }

    case WorkPackageActionTypes.AddObjectiveFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.DeleteObjective: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.DeleteObjectiveSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload
      };
    }

    case WorkPackageActionTypes.DeleteObjectiveFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.AddRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.AddRadioSuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload
      };
    }

    case WorkPackageActionTypes.AddRadioFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.DeleteRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.DeleteRadioSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload
      };
    }

    case WorkPackageActionTypes.DeleteRadioFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.SubmitWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.SubmitWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.ApproveWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.ApproveWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.ApproveWorkpackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.RejectWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.RejectWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.RejectWorkpackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.MergeWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.MergeWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.MergeWorkpackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.ResetWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.ResetWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.ResetWorkpackageFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.SupersedeWorkpackage: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.SupersedeWorkpackageSuccess: {
      return {
        ...state,
        loading: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.SupersedeWorkpackageFailure: {
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
