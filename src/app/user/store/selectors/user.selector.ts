import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/user.reducer';

export const getUserFeatureState = createFeatureSelector<State>('userFeature');

export const getUserEntities = createSelector(
    getUserFeatureState,
    state => state.entities
);

export const getUserSelected = createSelector(
    getUserFeatureState,
    state => state.selected
);

export const getUserLoading = createSelector(
    getUserFeatureState,
    state => state.loading
);

export const getUserError = createSelector(
    getUserFeatureState,
    state => state.error
);
