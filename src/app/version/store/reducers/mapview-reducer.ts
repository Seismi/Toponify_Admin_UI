import { HttpErrorResponse } from '@angular/common/http';
import { MapViewActionsUnion, MapViewActionTypes } from '../actions/mapview.actions';
import { MapView } from '../models/mapview.model';

export interface State {
  mapViews: MapView[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
  mapViewId: string;
}

export const initialState: State = {
  mapViews: null,
  loading: false,
  mapViewId: null
};

export function reducer(state = initialState, action: MapViewActionsUnion): State {
  switch (action.type) {

    case MapViewActionTypes.LoadMapView: {
      return {
        ...initialState,
        loading: true
      };
    }

    case MapViewActionTypes.LoadMapViewSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        mapViews: action.payload
      };
    }

    case MapViewActionTypes.LoadMapViewFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case MapViewActionTypes.SetMapView: {
      return {
        ...state,
        mapViewId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

