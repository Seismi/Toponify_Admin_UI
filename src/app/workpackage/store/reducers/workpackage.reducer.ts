import { HttpErrorResponse } from '@angular/common/http';
import { WorkPackageActionsUnion, WorkPackageActionTypes } from '../actions/workpackage.actions';
import { Links, Page, WorkPackageDetail, WorkPackageEntity, WorkPackagesActive } from '../models/workpackage.models';

export interface State {
  editId: string;
  entities: WorkPackageEntity[];
  active: any[];
  avaialabilities: any[] | null;
  baseline: any[];
  page: Page;
  links: Links;
  loading: boolean;
  loadingDetails: boolean;
  selectedWorkPackage: WorkPackageDetail;
  selectedWorkPackageIds: string[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  editId: null,
  entities: [],
  active: [],
  avaialabilities: null,
  baseline: [],
  page: null,
  links: null,
  loading: false,
  loadingDetails: false,
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

    case WorkPackageActionTypes.ArchiveWorkPackage: {
      const { workPackageId, archived } = action.payload;
      return {
        ...state,
        selectedWorkPackage: {
          ...state.selectedWorkPackage,
          ...state.selectedWorkPackage.availableActions,
          id: workPackageId,
          archived: archived,
          displayColour: state.selectedWorkPackage.displayColour
        }
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
        selectedWorkPackageIds: workPackages ? [...workPackages] : state.selectedWorkPackageIds,
        editId: resetEdit ? null : state.editId
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageBaselineAvailability:
    case WorkPackageActionTypes.GetWorkpackageAvailability: {
      return {
        ...state
      };
    }

    case WorkPackageActionTypes.GetWorkpackageAvailabilitySuccess: {
      return {
        ...state,
        avaialabilities: action.payload
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageBaselineAvailabilityFailure:
    case WorkPackageActionTypes.GetWorkpackageAvailabilityFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageBaselineAvailabilitySuccess: {
      return {
        ...state,
        baseline: action.payload,
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

    case WorkPackageActionTypes.LoadWorkPackagesActive: {
      return {
        ...state
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesActiveSuccess: {
      return {
        ...state,
        active: action.payload.data
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case WorkPackageActionTypes.LoadWorkPackage: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.LoadWorkPackageSuccess: {
      return {
        ...state,
        loadingDetails: false,
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
        loading: true,
        loadingDetails: true
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
        active: state.active.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        }),
        loading: false,
        loadingDetails: false
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

    case WorkPackageActionTypes.AddWorkPackageBaseline:
    case WorkPackageActionTypes.AddOwner: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.AddWorkPackageBaselineSuccess:
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
        loadingDetails: false
      };
    }

    case WorkPackageActionTypes.AddWorkPackageBaselineFailure:
    case WorkPackageActionTypes.AddOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loadingDetails: false
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackageBaseline:
    case WorkPackageActionTypes.DeleteOwner: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackageBaselineSuccess:
    case WorkPackageActionTypes.DeleteOwnerSuccess: {
      return {
        ...state,
        loadingDetails: false,
        selectedWorkPackage: action.payload,
        entities: state.entities.map(entity => {
          if (entity.id === action.payload.id) {
            return action.payload;
          }
          return entity;
        })
      };
    }

    case WorkPackageActionTypes.DeleteWorkPackageBaselineFailure:
    case WorkPackageActionTypes.DeleteOwnerFailure: {
      return {
        ...state,
        error: action.payload,
        loadingDetails: false
      };
    }

    case WorkPackageActionTypes.AddObjective: {
      return {
        ...state,
        loading: true,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.AddObjectiveSuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload,
        loading: false,
        loadingDetails: false
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
        loading: true,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.DeleteObjectiveSuccess: {
      return {
        ...state,
        loading: false,
        loadingDetails: false,
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
        loading: true,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.AddRadioSuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload,
        loadingDetails: false
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

    case WorkPackageActionTypes.UpdateCustomProperty: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.UpdateCustomPropertySuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload,
        loadingDetails: false
      };
    }

    case WorkPackageActionTypes.UpdateCustomPropertyFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    case WorkPackageActionTypes.DeleteCustomProperty: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case WorkPackageActionTypes.DeleteCustomPropertySuccess: {
      return {
        ...state,
        selectedWorkPackage: action.payload,
        loadingDetails: false
      };
    }

    case WorkPackageActionTypes.DeleteCustomPropertyFailure: {
      return {
        ...state,
        error: action.payload
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
