import { NotificationActionsUnion, NotificationActionTypes } from '../actions/notification.actions';
import { Notification } from '../models/notification.models';

export interface NotificationState {
  notifications: Notification[];
  loadError: any;
  open: boolean;
}

export const initialState: NotificationState = {
  notifications: null,
  loadError: null,
  open: false
};

export function reducer(state = initialState, action: NotificationActionsUnion): NotificationState {
  switch (action.type) {
    case NotificationActionTypes.GetAllSuccess:
      return {
        ...state,
        notifications: action.payload
      };

    case NotificationActionTypes.SetError:
      return {
        ...state,
        loadError: action.payload
      };

    case NotificationActionTypes.MarkAsReadSuccess:
      return {
        ...state,
        notifications: state.notifications.map(notification => {
          if (notification.id === action.payload.id) {
            return action.payload;
          }
          return notification;
        })
      };

    case NotificationActionTypes.DeleteSuccess:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };

    case NotificationActionTypes.DeleteApiError:
      return {
        ...state,
        loadError: null
      };

    case NotificationActionTypes.SetOpen:
      return {
        ...state,
        open: action.payload
      };

    case NotificationActionTypes.DeleteAll:
      return {
        ...state,
        notifications: []
      };

    default: {
      return state;
    }
  }
}
