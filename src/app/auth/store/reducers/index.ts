import * as fromRoot from '@app/core/store';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export interface AuthState {
  status: fromAuth.State;
}

export interface State extends fromRoot.State {
  auth: AuthState;
}

export const reducers: ActionReducerMap<AuthState> = {
  status: fromAuth.reducer
};

export const selectAuthState = createFeatureSelector<State, AuthState>('auth');

export const selectAuthStatusState = createSelector(
  selectAuthState,
  (state: AuthState) => state.status
);

export const getLoggedIn = createSelector(
  selectAuthStatusState,
  fromAuth.getLoggedIn
);
export const getUser = createSelector(
  selectAuthStatusState,
  fromAuth.getUser
);

export const getLoginPageError = createSelector(
  selectAuthStatusState,
  fromAuth.getError
);

export const selectLoggedInUser = () => {
  return createSelector(
    selectAuthStatusState,
    state => {
      return state.user;
    }
  );
};
