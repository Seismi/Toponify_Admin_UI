import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ChangePasswordModalComponent } from '../../containers/change-password-modal/change-password.component';

@Component({
  selector: 'smi-my-user-form',
  templateUrl: 'my-user-form.component.html',
  styleUrls: ['my-user-form.component.scss']
})
export class MyUserFormComponent {

  @Input() group: FormGroup;
  @Input() showButtons = true;
  @Input() isActive = false;
  @Input() disableEmailInput = true;
  toggle = false;

  roles = ['administrator', 'architect', 'team member'];
  teams = ['Team one', 'Team two', 'Team three'];

  constructor(public dialog: MatDialog) { }

  onSave() {
    this.isActive = !this.isActive;
    this.toggle = !this.toggle;
  }

  onChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '400px',
    });
  }

}


