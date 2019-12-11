import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ErrorState } from '@app/core/store/reducers/error.reducer';

export const getErrorFeatureState = createFeatureSelector<ErrorState>('error');

export const getErrorMessage = createSelector(
  getErrorFeatureState,
  state => state.error
);
