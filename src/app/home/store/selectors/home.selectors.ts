import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/home.reducers';

const getHomePageState = createFeatureSelector<State>('homePageFeature');

export const getMyWorkPackages = createSelector(
  getHomePageState,
  state => state.workpackages
);

export const getMyRadios = createSelector(
  getHomePageState,
  state => state.radios
);

export const getMyLayouts = createSelector(
  getHomePageState,
  state => state.layouts
);

export const getMyProfile = createSelector(
  getHomePageState,
  state => state.profile
);