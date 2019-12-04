import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ChangeUserPasswordService } from '../../components/change-password-form/services/change-password.service';
import { ChangeUserPasswordValidatorService } from '../../components/change-password-form/services/change-password-validator.service';
import { UserPassword } from '@app/settings/store/models/user.model';
import { Actions, ofType } from '@ngrx/effects';
import { UserActionTypes } from '../../store/actions/user.actions';

@Component({
  selector: 'smi-change-password-modal',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangeUserPasswordService, ChangeUserPasswordValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class ChangePasswordModalComponent {
  user: UserPassword;
  error: string = null;

  constructor(
    private actions: Actions,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    private changeUserPasswordService: ChangeUserPasswordService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  get changeUserPasswordForm(): FormGroup {
    return this.changeUserPasswordService.changeUserPasswordForm;
  }

  onConfirm(data: any) {
    if (!this.changeUserPasswordService.isValid) {
      return;
    }

    this.actions.pipe(ofType(UserActionTypes.UpdateUserPasswordFailure)).subscribe((error: any) => {
      alert(error.payload);
    });

    this.dialogRef.close({ user: this.changeUserPasswordForm.value });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
