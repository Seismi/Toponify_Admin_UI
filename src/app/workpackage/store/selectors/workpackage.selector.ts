import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '@app/workpackage/store/reducers/workpackage.reducer';

interface WorkPackageFeatureState {
  workpackage: State;
}

const getWorkPackageState = createFeatureSelector<WorkPackageFeatureState>('workpackageFeature');

export const getWorkPackageEntities = createSelector(
  getWorkPackageState,
  state => {
    return state.workpackage.entities;
  }
);
