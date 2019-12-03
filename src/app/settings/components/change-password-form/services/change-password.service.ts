import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeUserPasswordValidatorService } from './change-password-validator.service';

import { PasswordStrengthValidator } from './change-password-validator.service';

@Injectable()
export class ChangeUserPasswordService {
  public changeUserPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private changeUserPasswordValidatorService: ChangeUserPasswordValidatorService) {
    this.changeUserPasswordForm = this.fb.group(
      {
        oldPassword: [null, [Validators.required]],
        newPassword: [null, [Validators.required, PasswordStrengthValidator]],
        confirmNewPassword: [null, [Validators.required]]
      },
      {
        validator: ChangeUserPasswordValidatorService.MatchPassword
      }
    );
  }

  get isValid(): boolean {
    if (!this.changeUserPasswordForm.valid) {
      this.changeUserPasswordValidatorService.validateAllFormFields(this.changeUserPasswordForm);
      return false;
    }
    return true;
  }
}
