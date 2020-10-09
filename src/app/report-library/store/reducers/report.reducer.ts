import { HttpErrorResponse } from '@angular/common/http';
import { Links, Page, Report, ReportLibrary, DataNodes } from '../models/report.model';
import { ReportActionsUnion, ReportActionTypes } from '../actions/report.actions';
import { Tag } from '@app/architecture/store/models/node.model';

export interface State {
  loading: boolean;
  loadingDetails: boolean;
  entities: ReportLibrary[];
  selected: Report;
  availableTags: Tag[];
  dataNodes: DataNodes[];
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  loadingDetails: false,
  entities: [],
  selected: null,
  availableTags: null,
  dataNodes: [],
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: ReportActionsUnion): State {
  switch (action.type) {
    case ReportActionTypes.LoadReports: {
      return {
        ...state,
        loading: true
      };
    }

    case ReportActionTypes.LoadReportsSuccess: {
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page
      };
    }

    case ReportActionTypes.LoadReportsFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ReportActionTypes.LoadReport: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case ReportActionTypes.DeleteReportRadioSuccess:
    case ReportActionTypes.DeleteReportPropertySuccess:
    case ReportActionTypes.UpdateReportPropertySuccess:
    case ReportActionTypes.LoadReportSuccess: {
      return {
        ...state,
        loadingDetails: false,
        selected: action.payload
      };
    }

    case ReportActionTypes.DeleteReportPropertyFailure:
    case ReportActionTypes.UpdateReportPropertyFailure:
    case ReportActionTypes.LoadReportFail: {
      return {
        ...state,
        error: action.payload
      };
    }

    case ReportActionTypes.AddReport: {
      return {
        ...state,
        loading: true
      };
    }

    case ReportActionTypes.AddReportSuccess: {
      const addedEntity = action.payload.data;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case ReportActionTypes.AddReportFail: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case ReportActionTypes.UpdateReport: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case ReportActionTypes.UpdateReportSuccess: {
      const updatedEntity = action.payload.data;
      return {
        ...state,
        entities: state.entities.map(entity => {
          if (entity.id === updatedEntity.id) {
            return updatedEntity;
          }
          return entity;
        }),
        loadingDetails: false
      };
    }

    case ReportActionTypes.UpdateReportFail: {
      return {
        ...state,
        error: action.payload,
        loadingDetails: false
      };
    }

    case ReportActionTypes.DeleteReport: {
      return {
        ...state,
        loading: true
      };
    }

    case ReportActionTypes.DeleteReportSuccess: {
      return {
        ...state,
        selected: action.payload,
        entities: state.entities.filter(entity => {
          if (entity.id === state.selected.id) {
            return action.payload;
          }
          return entity;
        }),
        loading: false
      };
    }

    case ReportActionTypes.DeleteReportFail: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case ReportActionTypes.AddOwner: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case ReportActionTypes.AddReportRadioSuccess:
    case ReportActionTypes.DeleteReportTagsSuccess:
    case ReportActionTypes.AddReportTagsSuccess:
    case ReportActionTypes.AddOwnerSuccess:
    case ReportActionTypes.AddReportingConceptsSuccess:
    case ReportActionTypes.DeleteReportingConceptSuccess:
    case ReportActionTypes.SetDimensionFilterSuccess:
    case ReportActionTypes.RemoveDataSetsFromReportSuccess:
    case ReportActionTypes.AddDataSetsToReportSuccess: {
      return {
        ...state,
        selected: action.payload,
        loadingDetails: false
      };
    }

    case ReportActionTypes.DeleteOwner: {
      return {
        ...state,
        loadingDetails: true
      };
    }

    case ReportActionTypes.DeleteOwnerSuccess: {
      return {
        ...state,
        loadingDetails: false,
        selected: action.payload
      };
    }

    case ReportActionTypes.DeleteReportRadioFailure:
    case ReportActionTypes.AddReportRadioFailure:
    case ReportActionTypes.DeleteReportTagsFail:
    case ReportActionTypes.AddReportTagsFail:
    case ReportActionTypes.AddDataSetsToReportFail:
    case ReportActionTypes.RemoveDataSetsFromReportFail:
    case ReportActionTypes.AddOwnerFail:
    case ReportActionTypes.DeleteOwnerFail:
    case ReportActionTypes.DeleteReportingConceptFail:
    case ReportActionTypes.AddReportingConceptsFail:
    case ReportActionTypes.SetDimensionFilterFail: {
      return {
        ...state,
        error: action.payload,
        loadingDetails: false
      };
    }

    case ReportActionTypes.LoadReportTagsSuccess: {
      return {
        ...state,
        availableTags: action.payload
      };
    }

    case ReportActionTypes.LoadDataNodesSuccess: {
      return {
        ...state,
        dataNodes: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
