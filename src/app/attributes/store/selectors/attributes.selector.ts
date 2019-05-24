import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/attributes.reducer';

export const getAttributesFeatureState = createFeatureSelector<State>('attributesFeature');

export const getAttributes = createSelector(
    getAttributesFeatureState,
    state => state.attributes
);

export const getAttributesLoading = createSelector(
    getAttributesFeatureState,
    state => state.loading
);

export const getAttributesError = createSelector(
    getAttributesFeatureState,
    state => state.error
);