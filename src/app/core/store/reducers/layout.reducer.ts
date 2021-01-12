import { LayoutActionsUnion, LayoutActionTypes } from '../actions/layout.actions';

export interface LayoutState {
  selectedLeftDrawerTab: string;
  leftDrawerOpen: boolean;
}

export const initialState: LayoutState = {
  selectedLeftDrawerTab: null,
  leftDrawerOpen: false
};

export function reducer(state = initialState, action: LayoutActionsUnion): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.OpenLeftDrawer:
      return {
        ...state,
        leftDrawerOpen: true
      };

    case LayoutActionTypes.CloseLeftDrawer:
      return {
        ...state,
        leftDrawerOpen: false
      };

    case LayoutActionTypes.SelectLeftDrawerTab:
      return {
        ...state,
        selectedLeftDrawerTab: action.payload
      };

    default: {
      return state;
    }
  }
}

export const getLeftDrawerOpen = (state: LayoutState) => state.leftDrawerOpen;