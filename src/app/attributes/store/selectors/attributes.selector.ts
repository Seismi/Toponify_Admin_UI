import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/attributes.reducer';

export const getAttributesFeatureState = createFeatureSelector<State>('attributesFeature');

export const getAttributeEntities = createSelector(
  getAttributesFeatureState,
  state => state.entities
);

export const getSelectedAttribute = createSelector(
  getAttributesFeatureState,
  state => state.selectedAttribute
);

export const getAttributeById = (id: string) => {
  return createSelector(
    getAttributesFeatureState,
    state => {
      return state.entities.filter(entity => entity.id === id);
    }
  );
};
