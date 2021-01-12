import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { getSelectedLeftDrawerTab } from '@app/core/store/selectors/layout.selectors';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';

@Component({
  selector: 'app-drawer',
  templateUrl: './app-drawer.component.html',
  styleUrls: ['./app-drawer.component.scss']
})
export class AppDrawerComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(private layoutStore: Store<LayoutState>) { }

  @ViewChild('drawer') drawer: MatDrawer;

  ngOnInit(): void {
    this.subscription = this.layoutStore.pipe(select(getSelectedLeftDrawerTab)).subscribe(tab => {
      if (tab) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
