import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NotificationState } from '@app/core/store/reducers/notification.reducer';

export const getNotificationState = createFeatureSelector<NotificationState>('notifications');

export const getNewNotificationCount = createSelector(
  getNotificationState,
  state => (state.notifications ? state.notifications.filter(notification => !notification.read).length : 0)
);

export const getNotificationOpen = createSelector(
  getNotificationState,
  state => state.open
);

export const getNotifications = createSelector(
  getNotificationState,
  state =>
    state.notifications
      ? state.notifications.slice().sort((a, b) => {
          if (!a.read && b.read) {
            return -1;
          }
          if (a.read && !b.read) {
            return 1;
          }
          return 0;
        })
      : []
);
