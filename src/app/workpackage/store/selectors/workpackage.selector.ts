import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/workpackage.reducer';

const getWorkPackageState = createFeatureSelector<State>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state => state.entities.map(entity => {
    const wa = state.avaialabilities.find(availability => availability.id === entity.id);
    const newEntity = {
      ...entity,
      ...(wa && { isEditable: wa.isEditable, isSelectable: wa.isSelectable  }),
      selected: state.selectedWorkPackageIds.some(id => id === entity.id),
      edit: entity.id === state.editId
    };
    return newEntity;
  })
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
  state => state.entities.filter(item => item.selected)
);

export const getSelectedWorkpackageIds = createSelector(
  getWorkPackageState,
  state => state.entities.filter(item => item.selected).map(item => item.id)
);


export const getEditWorkpackages = createSelector(
  getWorkPackageState,
  state => state.entities.filter(item => item.edit)
);

export const getWorkPackageById = (id: string) => {
  return createSelector(
    getWorkPackageState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};
