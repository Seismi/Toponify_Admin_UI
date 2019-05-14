import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

export const getUserFeatureState = createFeatureSelector<UserState>('userFeature');

export const getUsers = createSelector(
  getUserFeatureState,
  state => state.users
);

export const getUsersLoading = createSelector(
  getUserFeatureState,
  state => state.loading
);

export const getUsersError = createSelector(
  getUserFeatureState,
  state => state.error
);

export const getUser = createSelector(
  getUserFeatureState,
  (state: UserState, props: {id: string}) => {
    return state.users.filter(user => user.id === props.id);
  }
);
