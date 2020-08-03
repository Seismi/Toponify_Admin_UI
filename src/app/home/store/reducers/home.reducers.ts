import { HttpErrorResponse } from '@angular/common/http';
import { HomePageActionsUnion, HomePageActionTypes } from '../actions/home.actions';
import { Links, WorkPackageEntity, Page } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { LayoutDetails } from '@app/layout/store/models/layout.model';
import { UserDetails, Favourites } from '@app/settings/store/models/user.model';
import { LoadingStatus } from '@app/architecture/store/models/node.model';
import { NotificationActionsUnion, NotificationActionTypes } from '@app/core/store/actions/notification.actions';

export interface State {
  workpackages: WorkPackageEntity[];
  radios: RadioEntity[];
  favourites: Favourites[];
  profile: UserDetails;
  loading: boolean;
  links: Links;
  error?: HttpErrorResponse | { message: string };
  loadingHomePage: LoadingStatus;
}

export const initialState: State = {
  workpackages: [],
  radios: [],
  favourites: [],
  profile: null,
  links: null,
  loading: false,
  error: null,
  loadingHomePage: null
};

export function reducer(state = initialState, action: HomePageActionsUnion | NotificationActionsUnion): State {
  switch (action.type) {
    case NotificationActionTypes.GetAll: {
      return {
        ...state,
        loadingHomePage: LoadingStatus.loading
      };
    }

    case NotificationActionTypes.GetAllSuccess: {
      return {
        ...state,
        loadingHomePage: LoadingStatus.loaded
      };
    }

    case HomePageActionTypes.LoadMyWorkPackages: {
      return {
        ...state,
        loadingHomePage: LoadingStatus.loading
      };
    }

    case HomePageActionTypes.LoadMyWorkPackagesSuccess: {
      return {
        ...state,
        workpackages: action.payload.data,
        links: action.payload.links,
        loading: false,
        loadingHomePage: LoadingStatus.loaded
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
        ...state,
        loadingHomePage: LoadingStatus.loading
      };
    }

    case HomePageActionTypes.LoadMyRadiosSuccess: {
      return {
        ...state,
        radios: action.payload.data,
        links: action.payload.links,
        loading: false,
        loadingHomePage: LoadingStatus.loaded
      };
    }

    case HomePageActionTypes.LoadMyRadiosFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case HomePageActionTypes.LoadMyProfile: {
      return {
        ...state,
        loadingHomePage: LoadingStatus.loading
      };
    }

    case HomePageActionTypes.LoadMyProfileSuccess: {
      return {
        ...state,
        profile: action.payload.data,
        loadingHomePage: LoadingStatus.loaded
      };
    }

    case HomePageActionTypes.LoadMyProfileFailure: {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }

    case HomePageActionTypes.LoadMyFavourites: {
      return {
        ...state,
        loadingHomePage: LoadingStatus.loading
      };
    }

    case HomePageActionTypes.LoadMyFavouritesSuccess: {
      return {
        ...state,
        favourites: action.payload.data,
        loadingHomePage: LoadingStatus.loaded
      };
    }

    case HomePageActionTypes.LoadMyFavouritesFailure: {
      return {
        ...state,
        error: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
