import { HttpErrorResponse } from '@angular/common/http';
import { ViewActionsUnion, ViewActionTypes } from '../actions/view.actions';


export interface State {
  zoomLevel: number;
  viewLevel: number;
}

export const initialState: State = {
  zoomLevel: 3,
  viewLevel: 1,
};

export function reducer(state = initialState, action: ViewActionsUnion): State {
  switch (action.type) {

    case ViewActionTypes.ViewModel: {
      return {
        ...state,
        viewLevel: action.payload
      };
    }

    case ViewActionTypes.ZoomModel: {
      return {
        ...state,
        zoomLevel: action.payload
      };
    }

    default: {
      return state;
    }
  }
}


