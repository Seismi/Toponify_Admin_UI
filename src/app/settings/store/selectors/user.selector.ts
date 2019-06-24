import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/user.reducer';

export const getUserFeatureState = createFeatureSelector<State>('userFeature');

export const getUsers = createSelector(
    getUserFeatureState,
    state => state.entities
);

export const getUserSelected = createSelector(
    getUserFeatureState,
    state => state.selected
);

export const getLoading = createSelector(
    getUserFeatureState,
    state => state.loading
);

export const getUserError = createSelector(
    getUserFeatureState,
    state => state.error
);
