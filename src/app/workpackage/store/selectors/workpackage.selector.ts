import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/workpackage.reducer';

const getWorkPackageState = createFeatureSelector<State>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state => state.entities
);

export const getSelectedWorkPackage = createSelector(
  getWorkPackageState,
  state => state.selectedWorkPackage
);

export const getSelectedWorkpackages = createSelector(
  getWorkPackageState,
  state => state.entities.filter(item => item.selected)
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
