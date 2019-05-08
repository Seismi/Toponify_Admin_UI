import { createFeatureSelector, createSelector, ActionReducerMap } from '@ngrx/store';
import * as fromView from './view.reducer';
import * as fromRoot from '@app/core/store/';

export interface ArchitectureState {
  view: fromView.State;
}

export interface State extends fromRoot.State {
  architectureFeature: ArchitectureState;
}

export const reducers: ActionReducerMap<ArchitectureState> = {
  view: fromView.reducer,
};

export const getArchitectureState = createFeatureSelector<State, ArchitectureState>('architectureFeature');

export const getViewState = createSelector(
  getArchitectureState,
  state => state.view
);

export const getZoomLevel = createSelector(
  getViewState,
  state => state.zoomLevel
);

export const getViewLevel = createSelector(
  getViewState,
  state => state.viewLevel
);
