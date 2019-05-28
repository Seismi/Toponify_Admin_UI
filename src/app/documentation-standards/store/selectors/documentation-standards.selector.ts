import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State as DocumentationStandardState } from '../reducers/documentation-standards.reducer';

export const getDocumentStandardFeatureState = createFeatureSelector<DocumentationStandardState>('documentationStandardFeature');

export const getDocumentStandards = createSelector(
    getDocumentStandardFeatureState,
    state => state.entities
);

export const getDocumentStandard = createSelector(
    getDocumentStandardFeatureState,
    state => state.selected
);


