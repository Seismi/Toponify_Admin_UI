import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { select, Store } from '@ngrx/store';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';

@Component({
  selector: 'smi-left-hand-pane',
  templateUrl: './left-hand-pane.component.html',
  styleUrls: ['./left-hand-pane.component.scss']
})
export class LeftHandPaneComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public selectedTab: string;

  constructor(private layoutStore: Store<LayoutState>) {}

  ngOnInit() {
    this.subscription = this.layoutStore
      .pipe(select(getSelectedLeftDrawerTab))
      .subscribe(tab => (this.selectedTab = tab));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onOpen(tab: string): void {
    if (this.selectedTab === tab) {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
    } else {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(tab));
    }
  }
}
