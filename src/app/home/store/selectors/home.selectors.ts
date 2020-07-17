import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../reducers/home.reducers';
import { LoadingStatus } from '@app/architecture/store/models/node.model';

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

export const getMyFavourites = createSelector(
  getHomePageState,
  state => state.favourites
);

export const getMyRoles = createSelector(
  getHomePageState,
  state => (state.profile ? state.profile.roles : null)
);

export const getHomePageLoadingStatus = createSelector(
  getHomePageState,
  state => state.loadingHomePage === LoadingStatus.loaded
);
