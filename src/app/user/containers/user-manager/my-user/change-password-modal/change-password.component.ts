import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ChangeUserPasswordService } from './change-password-form/services/change-password.service';
import { ChangeUserPasswordValidatorService } from './change-password-form/services/change-password-validator.service';

@Component({
  selector: 'smi-change-user-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangeUserPasswordService, ChangeUserPasswordValidatorService]
})
export class ChangeUserPasswordComponent {

  constructor(public dialogRef: MatDialogRef<ChangeUserPasswordComponent>,
              private changeUserPasswordService: ChangeUserPasswordService) {}

  get changeUserPasswordForm(): FormGroup {
    return this.changeUserPasswordService.changeUserPasswordForm;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
