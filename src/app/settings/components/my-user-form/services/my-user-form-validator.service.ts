import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Injectable()
export class MyUserFormValidatorService {
  constructor() {}

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

// Phone number validator
export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
  if (control.value) {
    const valid = control.value.match(/^\+?[1-9]{1}[0-9]{3,15}$/);
    return valid ? null : { invalidNumber: true };
  } else {
    return null;
  }
}

// Email validator
export function emailValidator(control) {
  // tslint:disable-next-line:max-line-length
  const valid = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    control.value
  );
  return valid ? null : { invalidEmail: { valid: false, value: control.valid } };
}
