import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RadioState } from '../reducers/radio.reducer';

export const getRadioFeatureState = createFeatureSelector<RadioState>('radioFeature');

export const getRadio = createSelector(
  getRadioFeatureState,
  state => state.radio
);

export const getRadioLoading = createSelector(
  getRadioFeatureState,
  state => state.loading
);

export const getRadioError = createSelector(
  getRadioFeatureState,
  state => state.error
);
