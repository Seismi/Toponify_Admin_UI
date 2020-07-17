import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';

enum LeftHandPaneTab {
  notifications = 'notifications',
  home = 'home'
}

@Component({
  selector: 'app-drawer',
  templateUrl: './app-drawer.component.html',
  styleUrls: ['./app-drawer.component.scss']
})
export class AppDrawerComponent implements OnInit, OnDestroy {
  public LeftHandPaneTab = LeftHandPaneTab;
  public selectedTab = null;
  private subscription: Subscription | null = null;
  @ViewChild('drawer') drawer: MatDrawer;
  @Input() tabTpls: TemplateRef<any>;

  constructor(private layoutStore: Store<LayoutState>) {}

  ngOnInit() {
    this.subscription = this.layoutStore.pipe(select(getSelectedLeftDrawerTab)).subscribe(tab => {
      this.selectedTab = tab;
      if (tab) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });
  }

  handleCloseDrawer(): void {
    this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
