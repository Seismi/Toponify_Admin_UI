import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/user.reducer';

export const getUserFeatureState = createFeatureSelector<State>('userFeature');

export const getUsers = createSelector(
    getUserFeatureState,
    state => state.entities
);

export const getUserRolesEntities = createSelector(
    getUserFeatureState,
    state => state.roles
)

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

export const getUserById = (id: string) => {
    return createSelector(
        getUserFeatureState,
      state => {
        return state.entities.filter(user => user.id === id);
      }
    );
}