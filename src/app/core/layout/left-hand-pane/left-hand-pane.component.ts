import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smi-left-hand-pane',
  templateUrl: './left-hand-pane.component.html',
  styleUrls: ['./left-hand-pane.component.scss']
})
export class LeftHandPaneComponent implements OnInit, OnDestroy {
  @Input() workPackageIsEditable: boolean;
  @Input() selectedLeftTab: number;
  @Input() sideNavActions = false;
  @Input() architecturePage = false;

  private subscription: Subscription | null = null;
  private selectedTab = null;

  constructor(private layoutStore: Store<LayoutState>) {}

  ngOnInit() {
    this.subscription = this.layoutStore
      .pipe(select(getSelectedLeftDrawerTab))
      .subscribe(tab => (this.selectedTab = tab));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onOpenSideBar(tab: any): void {
    if (this.selectedTab === tab) {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
    } else {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(tab));
    }
  }
}
