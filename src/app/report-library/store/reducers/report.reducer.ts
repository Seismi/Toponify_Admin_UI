
import { HttpErrorResponse } from '@angular/common/http';
import { ReportLibrary, Page, Links } from '../models/report.model';
import { ReportActionsUnion, ReportActionTypes } from '../actions/report.actions';

export interface State {
  loading: boolean;
  entities: ReportLibrary[];
  selected: ReportLibrary;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  entities: null,
  selected: null,
  page: null,
  links: null,
  error: null
};

export function reducer(state = initialState, action: ReportActionsUnion): State {
  switch (action.type) {

    case ReportActionTypes.LoadReports: {
      return {
        ...initialState,
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
        ...initialState,
        loading: true
      };
    }

    case ReportActionTypes.LoadReportSuccess: {
      return {
        ...state,
        loading: false,
        selected: action.payload
      };
    }

    case ReportActionTypes.LoadReportFail: {
      return {
        ...state,
        loading: false,
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
        loading: true
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
        loading: false
      };
    }

    case ReportActionTypes.UpdateReportFail: {
      return {
        ...state,
        error: action.payload,
        loading: false
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
        entities: state.entities.filter(entity => entity.id !== action.payload),
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

    default: {
      return state;
    }
  }
}
