import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/workpackage.reducer';

const getWorkPackageState = createFeatureSelector<State>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state =>
    state.entities.map(entity => {
      const wa = state.avaialabilities.find(availability => availability.id === entity.id);
      const newEntity = {
        ...entity,
        ...(wa && { isEditable: wa.isEditable, isSelectable: wa.isSelectable }),
        selected: state.selectedWorkPackageIds.some(id => id === entity.id),
        edit: entity.id === state.editId
      };
      return newEntity;
    })
);

export const getAllWorkPackages = createSelector(
  getWorkPackageState,
  state => state.entities
);

export const workpackageSelectAllowed = createSelector(
  getWorkPackageState,
  state => !state.loading
);

export const getSelectedWorkPackage = createSelector(
  getWorkPackageState,
  state => state.selectedWorkPackage
);

export const getSelectedWorkpackages = createSelector(
  getWorkPackageState,
  state => state.entities.filter(item => state.selectedWorkPackageIds.some(id => id === item.id))
);

export const getSelectablePackageIds = createSelector(
  getWorkPackageState,
  getSelectedWorkpackages,
  state => {
    return state.avaialabilities
      .filter(availability => availability.isSelectable)
      .map(availability => availability.id);
  }
);

export const getSelectedWorkpackageIds = createSelector(
  getWorkPackageState,
  state => state.selectedWorkPackageIds
);

export const getEditWorkpackages = createSelector(
  getWorkPackageState,
  state => state.entities.filter(item => item.id === state.editId)
);

export const getEditWorkpackage = createSelector(
  getWorkPackageState,
  state => state.editId
);

export const getWorkPackageBaselineAvailability = createSelector(
  getWorkPackageState,
  state => state.baseline
);

export const getWorkPackageById = createSelector(
  getWorkPackageState,
  (state, props?: {id: string}) => {
    console.log(props);
      return state.entities.filter(entity => entity.id === props.id);
    }
  );
