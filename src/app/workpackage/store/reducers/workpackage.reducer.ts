import { HttpErrorResponse } from '@angular/common/http';
import { WorkPackageActionsUnion, WorkPackageActionTypes } from '../actions/workpackage.actions';

export interface Page {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface WorkPackage {
  id: string;
  name: string;
  description: string;
  owners?: (OwnersEntityOrApproversEntity)[] | null;
  approvers?: (OwnersEntityOrApproversEntity)[] | null;
  hasErrors: boolean;
  status: string;
}

export interface OwnersEntityOrApproversEntity {
  id: string;
  name: string;
  type: string;
}

export interface State {
  list: WorkPackage[];
  page: Page;
  links: Links;
  loading: boolean;
  error?: HttpErrorResponse | { message: string };
}

export const initialState: State = {
  list: [],
  page: null,
  links: null,
  loading: false,
  error: null
};

export function reducer(state = initialState, action: WorkPackageActionsUnion): State {
  switch (action.type) {

    case WorkPackageActionTypes.LoadWorkPackages: {
      return {
        ...state,
        loading: true
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesSuccess: {
      return {
        ...state,
        list: action.payload,
        loading: false
      };
    }

    case WorkPackageActionTypes.LoadWorkPackagesFailure: {
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

