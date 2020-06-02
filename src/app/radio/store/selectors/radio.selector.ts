import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/radio.reducer';

export const getRadioFeatureState = createFeatureSelector<State>('radioFeature');

export const getRadioEntities = createSelector(
  getRadioFeatureState,
  state => state.entities
);

// NOTE: should return all necessary data
// for organizing table with pagination
export const getRadioTableData = createSelector(
  getRadioFeatureState,
  state => ({ entities: state.entities, page: state.page })
);

export const getSelectedRadio = createSelector(
  getRadioFeatureState,
  state => state.selectedRadio
);

export const getRadioFilter = createSelector(
  getRadioFeatureState,
  state => state.radioFilter
);

export const getRadioMatrix = createSelector(
  getRadioFeatureState,
  state => state.matrixData
);

export const getRadioAnalysis = createSelector(
  getRadioFeatureState,
  state => state.analysisData
);

export const getRadioViews = createSelector(
  getRadioFeatureState,
  state => (state.radioViews ? state.radioViews : [])
);

export const getRadioAvailableTags = createSelector(
  getRadioFeatureState,
  state => state.availableTags
);

export const getRadioById = (id: string) => {
  return createSelector(
    getRadioFeatureState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};
