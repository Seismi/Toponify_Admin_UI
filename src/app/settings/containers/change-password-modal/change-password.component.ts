import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ChangeUserPasswordService } from '../../components/change-password-form/services/change-password.service';
import { ChangeUserPasswordValidatorService } from '../../components/change-password-form/services/change-password-validator.service';

@Component({
  selector: 'smi-change-password-modal',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangeUserPasswordService, ChangeUserPasswordValidatorService]
})
export class ChangePasswordModalComponent {

  constructor(public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
              private changeUserPasswordService: ChangeUserPasswordService) {}

  get changeUserPasswordForm(): FormGroup {
    return this.changeUserPasswordService.changeUserPasswordForm;
  }

  onCancel() {
    this.dialogRef.close();
  }
}
