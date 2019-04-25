import { HttpErrorResponse } from '@angular/common/http';
import { Model } from '../models/model-version.model';
import { ModelActionTypes, ModelActionsUnion } from '../actions/model.actions';


export interface State {
  models: Model[];
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  models: null,
  loading: false
};

export function reducer(state = initialState, action: ModelActionsUnion): State {
  switch (action.type) {

    case ModelActionTypes.LoadModels: {
      return {
        ...initialState,
        loading: true
      };
    }

    case ModelActionTypes.LoadModelsSuccess: {
      return {
        ...state,
        loading: false,
        error: null,
        models: action.payload
      };
    }

    case ModelActionTypes.LoadModelsFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelActionTypes.AddModel: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelActionTypes.AddModelSuccess: {
      return {
        ...state,
        loading: false,
        models: [...state.models, action.payload]
      };
    }

    case ModelActionTypes.AddModelFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelActionTypes.UpdateModel: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelActionTypes.UpdateModelSuccess: {
      return {
        ...state,
        loading: false,
        models: state.models.map(model =>
          model.id === action.payload.id
            ? { ...model, ...action.payload }
            : model
        )
      };
    }

    case ModelActionTypes.UpdateModelFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case ModelActionTypes.DeleteModel: {
      return {
        ...state,
        loading: true
      };
    }

    case ModelActionTypes.DeleteModelSuccess: {
      return {
        ...state,
        loading: false,
        models: state.models.filter((model) => model.id !== action.payload)
      };
    }

    case ModelActionTypes.DeleteModelFailure: {
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

