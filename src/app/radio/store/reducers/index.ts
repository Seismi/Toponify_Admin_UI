import * as fromRadio from '../reducers/radio.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/radio.reducer';
import { Radio } from '../models/radio.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface RadioState {
    loading: boolean;
    radio: Radio[];
    error?: HttpErrorResponse | { message: string };
}

export const getRadioState = createFeatureSelector<State>('radioFeature');

export const getRadio = createSelector(
  getRadioState,
  fromRadio.getRadio
);

export const getLoading = createSelector(
  getRadioState,
  fromRadio.getLoading
);
