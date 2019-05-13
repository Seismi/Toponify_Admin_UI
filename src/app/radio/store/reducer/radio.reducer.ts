import { RadioActionsUnion, RadioActionTypes } from '../actions/radio.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { Radio } from '../models/radio.model';

export interface State {
  loading: boolean;
  radio: Radio[];
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  loading: false,
  radio: [],
  error: null,
};

export function reducer(state = initialState, action: RadioActionsUnion): State {
  switch (action.type) {

    case RadioActionTypes.LoadRadio: {
      return {
        ...initialState
      };
    }

     case RadioActionTypes.LoadRadioSuccess: {
      return {
        ...state,
        loading: false,
        radio: action.payload
      };
    }

    case RadioActionTypes.LoadRadioFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RadioActionTypes.LoadReplyRadio: {
      return {
        ...state,
        loading: true,
      };
    }

     case RadioActionTypes.LoadReplyRadioSuccess: {
      return {
        ...state,
        loading: false,
        radio: state.radio.map(radio =>
          radio.id === action.payload.id
            ? { ...radio, ...action.payload }
            : radio
        )
      };
    }

    case RadioActionTypes.LoadReplyRadioFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RadioActionTypes.AddRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.AddRadioSuccess: {
      return {
        ...state,
        loading: false,
        radio: [...state.radio, action.payload]
      };
    }

    case RadioActionTypes.AddRadioFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RadioActionTypes.ReplyRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.ReplyRadioSuccess: {
      return {
        ...state,
        loading: false,
        radio: state.radio.map(radio =>
          radio.id === action.payload.id
            ? { ...radio, ...action.payload }
            : radio
        )
      };
    }

    case RadioActionTypes.ReplyRadioFail: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RadioActionTypes.ArchiveRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.ArchiveRadioSuccess: {
      return {
        ...state,
        loading: false,
        radio: [...state.radio, action.payload]
      };
    }

    case RadioActionTypes.ArchiveRadioFail: {
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

export const getRadio = (state: State) => state.radio;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
