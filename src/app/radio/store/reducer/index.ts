import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRadio from '../reducer/radio.reducer';
import { Radio } from '../models/radio.model';

export interface RadioState {
  loading: boolean;
  radio: Radio[];
}

export const getRadioState = createFeatureSelector<RadioState>('radioFeature');

export const getRadio = createSelector(
  getRadioState,
  fromRadio.getRadio
);

export const getLoading = createSelector(
  getRadioState,
  fromRadio.getLoading
);

export const getRadioError = createSelector(
  getRadioState,
  fromRadio.getError
);

export const getRadioById = (radioId: string) => {
  return createSelector(
    getRadioState,
    state => {
      return state.radio.filter(radio => radio.id === radioId);
    }
  );
}

