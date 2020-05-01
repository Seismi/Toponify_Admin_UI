import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NotificationState } from '@app/core/store/reducers/notification.reducer';
import { getNewNotificationCount, getNotificationOpen } from '@app/core/store/selectors/notification.selectors';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NotificationPanelOpen } from '@app/core/store/actions/notification.actions';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';

@Component({
  selector: 'smi-notification-indicator',
  templateUrl: './notification-indicator.component.html',
  styleUrls: ['./notification-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationIndicatorComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  count: null | number = null;
  selectedTab: null | string = null;

  constructor(
    private notificationStore: Store<NotificationState>,
    private layoutStore: Store<LayoutState>,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.notificationStore.pipe(select(getNewNotificationCount)).subscribe(count => {
        this.count = !!count ? count : null;
        this.ref.detectChanges();
      })
    );
    this.subscriptions.push(
      this.layoutStore.pipe(select(getSelectedLeftDrawerTab)).subscribe(tab => {
        this.selectedTab = tab;
        this.ref.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleClick(): void {
    if (this.selectedTab === 'notifications') {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
    } else {
      this.layoutStore.dispatch(new SelectLeftDrawerTab('notifications'));
    }
  }
}
