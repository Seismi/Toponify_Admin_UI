import { HttpErrorResponse } from '@angular/common/http';
import { DimensionActionsUnion, DimensionActionTypes } from '../actions/dimension.actions';
import { Dimension } from '../models/dimension.model';


export interface State {
  dimensions: Dimension[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  dimensions: null,
  loading: false
};

export function reducer(state = initialState, action: DimensionActionsUnion): State {
  switch (action.type) {

    case DimensionActionTypes.LoadDimensions: {
      return {
        ...initialState,
        loading: true
      };
    }

    case DimensionActionTypes.LoadDimensionsSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        dimensions: action.payload
      };
    }

    case DimensionActionTypes.LoadDimensionsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionActionTypes.AddDimension: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionActionTypes.AddDimensionSuccess: {
      return {
        ...state,
        loading: false,
        dimensions: [...state.dimensions, action.payload]
      };
    }

    case DimensionActionTypes.AddDimensionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionActionTypes.UpdateDimension: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionActionTypes.UpdateDimensionSuccess: {
      return {
        ...state,
        loading: false,
        dimensions: state.dimensions.map((dimension) =>
          dimension.id === action.payload.id
            ? { ...dimension, ...action.payload }
            : dimension
        )
      };
    }

    case DimensionActionTypes.UpdateDimensionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case DimensionActionTypes.DeleteDimension: {
      return {
        ...state,
        loading: true
      };
    }

    case DimensionActionTypes.DeleteDimensionSuccess: {
      return {
        ...state,
        loading: false,
        dimensions: state.dimensions.filter((dimension) => dimension.id !== action.payload)
      };
    }

    case DimensionActionTypes.DeleteDimensionFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

