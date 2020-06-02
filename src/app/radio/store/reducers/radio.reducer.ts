import { RadioActionsUnion, RadioActionTypes } from '../actions/radio.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { RadioEntity, Page, Links, RadioDetail, Reply, RadiosAdvancedSearch } from '../models/radio.model';
import { Tag } from '@app/architecture/store/models/node.model';

export interface State {
  entities: RadioEntity[];
  availableTags: Tag[];
  page: Page;
  links: Links;
  loading: boolean;
  selectedRadio: RadioDetail;
  reply: Reply[];
  radioFilter: any; // RadiosAdvancedSearch;
  radioViews: any[] | null;
  error?: HttpErrorResponse | { message: string };
  analysisData: any;
  matrixData: any;
}

export const initialState: State = {
  entities: [],
  availableTags: null,
  page: null,
  links: null,
  loading: false,
  selectedRadio: null,
  reply: [],
  radioFilter: null,
  error: null,
  radioViews: null,
  analysisData: null,
  matrixData: null
};

export function reducer(state = initialState, action: RadioActionsUnion): State {
  switch (action.type) {
    case RadioActionTypes.SetRadioViewAsFavouriteSuccess: {
      return {
        ...state,
        radioViews: state.radioViews.map(view => {
          if (view.id === action.payload) {
            return {
              ...view,
              favourite: true
            };
          }
          return view;
        })
      };
    }

    case RadioActionTypes.UnsetRadioViewAsFavouriteSuccess: {
      return {
        ...state,
        radioViews: state.radioViews.map(view => {
          if (view.id === action.payload) {
            return {
              ...view,
              favourite: false
            };
          }
          return view;
        })
      };
    }

    case RadioActionTypes.GetRadioViewSuccess: {
      const filterSet = action.payload.filterSet;
      return {
        ...state,
        radioFilter: { ...filterSet, tableStyle: action.payload.type }
      };
    }

    case RadioActionTypes.GetRadioViewsSuccess: {
      return {
        ...state,
        radioViews: action.payload
      };
    }

    case RadioActionTypes.CreateRadioViewSuccess: {
      return {
        ...state,
        radioViews: [
          ...state.radioViews,
          {
            name: action.payload.name,
            id: action.payload.id,
            favourite: action.payload.favourite
          }
        ]
      };
    }

    case RadioActionTypes.CreateRadioViewFail: {
      // TODO:
      return {
        ...state
      };
    }

    case RadioActionTypes.UpdateRadioViewSuccess: {
      // TODO: dont do anything there
      return {
        ...state
      };
    }

    case RadioActionTypes.UpdateRadioViewFail: {
      return {
        ...state
      };
    }

    case RadioActionTypes.DeleteRadioViewSuccess: {
      return {
        ...state,
        radioViews: state.radioViews.filter(radioView => radioView.id !== action.payload)
      };
    }

    case RadioActionTypes.DeleteRadioViewFail: {
      return {
        ...state
      };
    }

    case RadioActionTypes.LoadRadios: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.LoadRadiosSuccess: {
      return {
        ...state,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false
      };
    }

    case RadioActionTypes.LoadRadiosFailure: {
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    }

    case RadioActionTypes.LoadRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.AddRadioTagsSuccess:
    case RadioActionTypes.DeleteRadioTagsSuccess:
    case RadioActionTypes.LoadRadioSuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.AddRadioTagsFail:
    case RadioActionTypes.DeleteRadioTagsFail:
    case RadioActionTypes.LoadRadioFailure: {
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
      const addedEntity = action.payload;
      return {
        ...state,
        entities: [...state.entities, addedEntity],
        loading: false
      };
    }

    case RadioActionTypes.AddRadioFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case RadioActionTypes.AddReply: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.AddReplySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload,
        entities: state.entities.map(entity =>
          entity.id === action.payload.id ? { ...entity, ...action.payload } : entity
        )
      };
    }

    case RadioActionTypes.AddReplyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case RadioActionTypes.UpdateRadioProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.UpdateRadioPropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.UpdateRadioPropertyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case RadioActionTypes.DeleteRadioProperty: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.DeleteRadioPropertySuccess: {
      return {
        ...state,
        loading: false,
        selectedRadio: action.payload
      };
    }

    case RadioActionTypes.DeleteRadioPropertyFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case RadioActionTypes.SearchRadio: {
      return {
        ...state,
        loading: true
      };
    }

    case RadioActionTypes.SearchRadioSuccess: {
      return {
        ...state,
        entities: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false
      };
    }

    case RadioActionTypes.GetRadioMatrixSuccess: {
      return {
        ...state,
        matrixData: action.payload
      };
    }

    case RadioActionTypes.GetRadioAnalysisSuccess: {
      return {
        ...state,
        analysisData: action.payload
      };
    }

    case RadioActionTypes.SearchRadioFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case RadioActionTypes.RadioFilter: {
      const tableStyle = action.payload ? action.payload.tableStyle || state.radioFilter.tableStyle : null;
      return {
        ...state,
        radioFilter: { ...action.payload, tableStyle }
      };
    }

    case RadioActionTypes.DeleteRadioEntitySuccess: {
      return {
        ...state,
        entities: state.entities.filter(entity => entity.id !== action.payload)
      };
    }

    case RadioActionTypes.LoadRadioTagsSuccess: {
      return {
        ...state,
        availableTags: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
