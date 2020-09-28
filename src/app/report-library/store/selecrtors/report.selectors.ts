import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as ReportState } from '../reducers/report.reducer';

export const getReportFeatureState = createFeatureSelector<ReportState>('reportLibraryFeature');

export const getReportEntities = createSelector(
  getReportFeatureState,
  state => ({ entities: state.entities, page: state.page })
);

export const getReportSelected = createSelector(
  getReportFeatureState,
  state => state.selected
);

export const getReportsLoading = createSelector(
  getReportFeatureState,
  state => state.loading
);

export const getReportsDetailsLoading = createSelector(
  getReportFeatureState,
  state => state.loadingDetails
);

export const getLayoutError = createSelector(
  getReportFeatureState,
  state => state.error
);

export const getReportAvailableTags = createSelector(
  getReportFeatureState,
  state => state.availableTags
);

export const getReportDataNodes = createSelector(
  getReportFeatureState,
  state => state.dataNodes
);

