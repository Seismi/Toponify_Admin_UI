import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from '../reducers/scope.reducer';

export const getScopeFeatureState = createFeatureSelector<State>('scopeFeature');

export const getScopeEntities = createSelector(
    getScopeFeatureState,
    state => state.entities
);

export const getScopeSelected = createSelector(
    getScopeFeatureState,
    state => state.selected
);

export const getScopeLoading = createSelector(
    getScopeFeatureState,
    state => state.loading
);

export const getScopeError = createSelector(
    getScopeFeatureState,
    state => state.error
);

export const getScopeById = (id: string) => {
    return createSelector(
      getScopeFeatureState,
      state => {
        return state.entities.filter(entity => entity.id === id);
      }
    );
};