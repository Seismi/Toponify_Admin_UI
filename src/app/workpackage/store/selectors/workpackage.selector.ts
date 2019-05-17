import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/workpackage.reducer';

const getWorkPackageState = createFeatureSelector<State>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state => state.entities
);

export const getWorkPackageById = (id: string) => {
  return createSelector(
    getWorkPackageState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};
