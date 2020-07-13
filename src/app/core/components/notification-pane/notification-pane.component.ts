import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { NotificationState } from '@app/core/store/reducers/notification.reducer';
import { getNotifications } from '@app/core/store/selectors/notification.selectors';
import { NotificationMarkAsRead, NotificationDelete, NotificationMarkAllAsRead, NotificationDeleteAll } from '@app/core/store/actions/notification.actions';
import { Subscription } from 'rxjs';
import { Notification } from '@app/core/store/models/notification.models';

@Component({
  selector: 'smi-notification-pane',
  templateUrl: './notification-pane.component.html',
  styleUrls: ['./notification-pane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPaneComponent implements OnInit, OnDestroy {
  searchString: string
  subscriptions: Subscription[] = [];
  notifications: Notification[] = [];
  constructor(private notificationStore: Store<NotificationState>, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.notificationStore.pipe(select(getNotifications)).subscribe(notifications => {
        this.notifications = notifications;
        this.ref.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleMarkAsRead(id: string): void {
    this.notificationStore.dispatch(new NotificationMarkAsRead(id));
  }

  handleDelete(id: string): void {
    this.notificationStore.dispatch(new NotificationDelete(id));
  }

  markAllAsRead(): void {
    this.notificationStore.dispatch(new NotificationMarkAllAsRead());
  }

  deleteAll(): void {
    this.notificationStore.dispatch(new NotificationDeleteAll());
  }
}
