import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/radio.reducer';
import { mergeWith, isArray } from 'lodash';
import { LoadingStatus } from '@app/architecture/store/models/node.model';

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

export const getMergedRadioFilters = createSelector(
  getRadioFeatureState,
  state => {
    const filter = mergeWith(
      { ...state.radioFilter },
      { ...state.analysisFilter },
      (objValue, srcValue, key, object, source, stack) => (isArray(objValue) ? srcValue : undefined)
    );
    return filter;
  }
);

export const getRadioDefaultFilter = createSelector(
  getRadioFeatureState,
  state => state.radioFilter
);

export const getRadioMatrixFilter = createSelector(
  getRadioFeatureState,
  state => state.matrixFilter
);

export const getRadioAnalysisFilter = createSelector(
  getRadioFeatureState,
  state => state.analysisFilter
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

export const getRadiosLoadingStatus = createSelector(
  getRadioFeatureState,
  state => {
    if (state.loadingRadios === LoadingStatus.loaded) {
      return LoadingStatus.loaded;
    }
    return LoadingStatus.loading;
  }
);

export const getRadioLoadingStatus = createSelector(
  getRadioFeatureState,
  state => {
    if (state.loadingRadio === LoadingStatus.loaded) {
      return LoadingStatus.loaded;
    }
    return LoadingStatus.loading;
  }
);
