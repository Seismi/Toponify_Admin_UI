import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State as DocumentationStandardState } from '../reducers/documentation-standards.reducer';
import { LoadingStatus } from '@app/architecture/store/models/node.model';

export const getDocumentStandardFeatureState = createFeatureSelector<DocumentationStandardState>(
  'documentationStandardFeature'
);

export const getDocumentStandards = createSelector(
  getDocumentStandardFeatureState,
  state => state.entities
);

export const getDocumentStandardPage = createSelector(
  getDocumentStandardFeatureState,
  state => state.page
);

export const getDocumentStandard = createSelector(
  getDocumentStandardFeatureState,
  state => state.selected
);

export const getDocumentStandardById = (id: string) => {
  return createSelector(
    getDocumentStandardFeatureState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};

export const getDocumentStandardsLoadingStatus = createSelector(
  getDocumentStandardFeatureState,
  state => {
    if (state.loadingDocumentStandards === LoadingStatus.loaded) {
      return LoadingStatus.loaded;
    }
    return LoadingStatus.loading;
  }
);

export const getDocumentStandardLoadingStatus = createSelector(
  getDocumentStandardFeatureState,
  state => {
    if (state.loadingDocumentStandard === LoadingStatus.loaded) {
      return LoadingStatus.loaded;
    }
    return LoadingStatus.loading;
  }
);
