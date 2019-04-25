import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';
import { User } from '../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserState {
  loading: boolean;
  users: User[];
  error?: HttpErrorResponse | { message: string };
}

export const getUserState = createFeatureSelector<UserState>('userFeature');

export const getLoading = createSelector(
  getUserState,
  fromUser.getLoading
);

export const getUsers = createSelector(
  getUserState,
  fromUser.getUsers
);

export const getUserPageError = createSelector(
    getUserState,
    fromUser.getError
);

export const getUserById = (userId: string) => {
  return createSelector(
    getUserState,
    state => {
      return state.users.filter(user => user.id === userId);
    }
  );
};