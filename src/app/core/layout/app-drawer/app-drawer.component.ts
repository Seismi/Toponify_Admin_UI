import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer'; 
import { workpackageLoading } from '@app/workpackage/store/selectors/workpackage.selector';

enum LeftHandPaneTab {
  notifications = 'notifications',
  menu = 'menu'
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
  public isLoading: boolean;
  @ViewChild('drawer') drawer: MatDrawer;
  @Input() tabTpls: TemplateRef<any>;

  constructor(
    private store: Store<WorkPackageState>,
    private layoutStore: Store<LayoutState>
  ) {}

  ngOnInit() {
    this.subscription = this.layoutStore.pipe(select(getSelectedLeftDrawerTab)).subscribe(tab => {
      this.selectedTab = tab;
      if (tab) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });

    if (!this.tabTpls) {
      this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
    }

    this.subscription = this.store.pipe(select(workpackageLoading)).subscribe((loading) => this.isLoading = loading);
  }

  handleCloseDrawer(): void {
    this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
