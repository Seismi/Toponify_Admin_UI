import { State as ReportState } from '../reducers/report.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const getReportFeatureState = createFeatureSelector<ReportState>('reportLibraryFeature');

export const getReportEntities = createSelector(
  getReportFeatureState,
  state => state.entities
);

export const getReportSelected = createSelector(
  getReportFeatureState,
  state => state.selected
);

export const getReportLoading = createSelector(
  getReportFeatureState,
  state => state.loading
);

export const getLayoutError = createSelector(
  getReportFeatureState,
  state => state.error
);

export const getReportAvailableTags = createSelector(
  getReportFeatureState,
  state => state.availableTags
);
