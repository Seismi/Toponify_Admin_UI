import { HttpErrorResponse } from '@angular/common/http';
import { HomePageActionsUnion, HomePageActionTypes } from '../actions/home.actions';
import { Page, Links, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutEntity } from '@app/layout/store/models/layout.model';
import { UserDetails } from '@app/settings/store/models/user.model';

export interface State {
  workpackages: WorkPackageEntity[];
  radios: RadioEntity[];
  layouts: LayoutEntity[];
  profile: UserDetails;
  loading: boolean;
  page: Page;
  links: Links;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  workpackages: [],
  radios: [],
  layouts: [],
  profile: null,
  page: null,
  links: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: HomePageActionsUnion): State {
  switch (action.type) {

    case HomePageActionTypes.LoadMyWorkPackages: {
      return {
        ...state
      };
    }

    case HomePageActionTypes.LoadMyWorkPackagesSuccess: {
      return {
        ...state,
        workpackages: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false
      };
    }

    case HomePageActionTypes.LoadMyWorkPackagesFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case HomePageActionTypes.LoadMyRadios: {
      return {
        ...state
      };
    }

    case HomePageActionTypes.LoadMyRadiosSuccess: {
      return {
        ...state,
        radios: action.payload.data,
        links: action.payload.links,
        loading: false
      };
    }

    case HomePageActionTypes.LoadMyRadiosFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case HomePageActionTypes.LoadMyLayouts: {
      return {
        ...state
      };
    }

    case HomePageActionTypes.LoadMyLayoutsSuccess: {
      return {
        ...state,
        layouts: action.payload.data,
        links: action.payload.links,
        page: action.payload.page,
        loading: false
      };
    }

    case HomePageActionTypes.LoadMyLayoutsFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }


    case HomePageActionTypes.LoadMyProfile: {
      return {
        ...state
      };
    }

    case HomePageActionTypes.LoadMyProfileSuccess: {
      return {
        ...state,
        profile: action.payload.data
      };
    }

    case HomePageActionTypes.LoadMyProfileFailure: {
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
