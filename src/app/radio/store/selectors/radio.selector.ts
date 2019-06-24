import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/radio.reducer';

export const getRadioFeatureState = createFeatureSelector<State>('radioFeature');

export const getRadioEntities = createSelector(
  getRadioFeatureState,
  state => state.entities
);

export const getSelectedRadio = createSelector(
  getRadioFeatureState,
  state => state.selectedRadio
);

export const getRadioById = (id: string) => {
  return createSelector(
    getRadioFeatureState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};
