export interface Notification {
  id: string;
  message: string;
  createdOn: string;
  important: boolean;
  read: boolean;
}

export interface NotificationGetAllResponseSuccess {
  data: Notification[];
}

export interface NotificationMarkAsReadResponseSuccess {
  data: Notification;
}

export interface NotificationDeleteResponseSuccess {
  data?: any;
}
