import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NotificationState } from '@app/core/store/reducers/notification.reducer';
import { getNewNotificationCount, getNotificationOpen } from '@app/core/store/selectors/notification.selectors';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NotificationPanelOpen } from '@app/core/store/actions/notification.actions';

@Component({
  selector: 'smi-notification-indicator',
  templateUrl: './notification-indicator.component.html',
  styleUrls: ['./notification-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationIndicatorComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  count: null | number = null;
  open = false;

  constructor(private notificationStore: Store<NotificationState>, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.notificationStore.pipe(select(getNewNotificationCount)).subscribe(count => {
        this.count = !!count ? count : null;
        this.ref.detectChanges();
      })
    );
    this.subscriptions.push(
      this.notificationStore.pipe(select(getNotificationOpen)).subscribe(open => {
        this.open = open;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleClick(): void {
    this.notificationStore.dispatch(new NotificationPanelOpen(!this.open));
  }
}
