import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable()
export class ChangeUserPasswordValidatorService {

  constructor() { }

   // Password match validator
  static MatchPassword(AC: AbstractControl) {
    const newPassword = AC.get('newPassword').value;
    const confirmNewPassword = AC.get('confirmNewPassword').value;
     if(newPassword != confirmNewPassword) {
        AC.get('confirmNewPassword').setErrors( {MatchPassword: true} );
     } else {
        return null;
     }
  }

  // Validate all form fields
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}

// Password strength validator
export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  if (!value) {
    return null;
  }

  const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    return { passwordStrength: `Password should have a special character` };
  }

  const numberCharacters = /[0-9]+/g;
  if (numberCharacters.test(value) === false) {
    return { passwordStrength: `Password should have a number` };
  }

  const minLength = /^.{8,}$/g;
  if (minLength.test(value) === false) {
    return { passwordStrength: `Password should have at least 8 characters` };
  }

  return null;
}
