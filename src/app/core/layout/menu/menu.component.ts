import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { LayoutState } from '@app/core/store/reducers/layout.reducer';
import { SelectLeftDrawerTab } from '@app/core/store/actions/layout.actions';
import { MatDialog } from '@angular/material';
import { ManageTagsModalComponent } from '@app/architecture/components/tag-list/manage-tags-modal/manage-tags-modal.component';

@Component({
  selector: 'smi-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private layoutStore: Store<LayoutState>
  ) {}

  ngOnInit() {}

  itemClick(): void {
    this.layoutStore.dispatch(new SelectLeftDrawerTab(null));
  }

  manageTags(): void {
    this.itemClick();
    this.dialog.open(ManageTagsModalComponent, { disableClose: false, minWidth: '600px' });
  }

  onLogOut() {
    this.authService.logout();
  }
}
