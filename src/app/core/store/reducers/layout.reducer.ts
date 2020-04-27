import { LayoutActionsUnion, LayoutActionTypes } from '../actions/layout.actions';

export interface LayoutState {
  selectedLeftDrawerTab: any;
  rightDrawerOpen: boolean;
  leftDrawerOpen: boolean;
}

export const initialState: LayoutState = {
  leftDrawerOpen: false,
  rightDrawerOpen: false,
  selectedLeftDrawerTab: null
};

export function reducer(state = initialState, action: LayoutActionsUnion): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.OpenLeftDrawer:
      return {
        ...state,
        leftDrawerOpen: true,
        rightDrawerOpen: false
      };

    case LayoutActionTypes.OpenRightDrawer:
      return {
        ...state,
        leftDrawerOpen: false,
        rightDrawerOpen: true
      };

    case LayoutActionTypes.CloseLeftDrawer:
    case LayoutActionTypes.CloseRightDrawer:
      return {
        ...state,
        leftDrawerOpen: false,
        rightDrawerOpen: false
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
export const getRightDrawerOpen = (state: LayoutState) => state.rightDrawerOpen;
