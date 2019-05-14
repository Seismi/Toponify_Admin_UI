import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/workpackage.reducer';

export interface WorkPackageFeatureState {
  workpackage: State;
}

const getWorkPackageState = createFeatureSelector<WorkPackageFeatureState>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state => state.entities
);

export const getWorkPackageById = (id: string) => {
  return createSelector(
    getWorkPackageState,
    state => {
      return state.workpackage.entities.filter(entity => entity.id === id);
    }
  );
}
