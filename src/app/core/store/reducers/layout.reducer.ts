import { LayoutActionsUnion, LayoutActionTypes } from '../actions/layout.actions';

export interface LayoutState {
  rightDrawerOpen: boolean;
  leftDrawerOpen: boolean;
}

export const initialState: LayoutState = {
  leftDrawerOpen: false,
  rightDrawerOpen: false
};

export function reducer(state = initialState, action: LayoutActionsUnion): LayoutState {
  switch (action.type) {
    case LayoutActionTypes.OpenLeftDrawer:
      return {
        leftDrawerOpen: true,
        rightDrawerOpen: false
      };

    case LayoutActionTypes.OpenRightDrawer:
      return {
        leftDrawerOpen: false,
        rightDrawerOpen: true
      };

    case LayoutActionTypes.CloseLeftDrawer:
    case LayoutActionTypes.CloseRightDrawer:
      return {
        ...initialState
      };

    default: {
      return state;
    }
  }
}

export const getLeftDrawerOpen = (state: LayoutState) => state.leftDrawerOpen;
export const getRightDrawerOpen = (state: LayoutState) => state.rightDrawerOpen;
