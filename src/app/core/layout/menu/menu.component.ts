import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';

@Component({
  selector: 'smi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(private authService: AuthService, private layoutStore: Store<LayoutState>) {}

  ngOnInit() {}

  itemClick(): void {
    this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
  }

  onLogOut() {
    this.authService.logout();
  }
}
