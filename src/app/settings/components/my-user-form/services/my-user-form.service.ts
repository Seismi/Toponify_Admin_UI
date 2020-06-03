import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MyUserFormValidatorService, phoneNumberValidator, emailValidator } from './my-user-form-validator.service';

@Injectable()
export class MyUserFormService {
  public myUserForm: FormGroup;

  constructor(private fb: FormBuilder, private myUserFormValidatorService: MyUserFormValidatorService) {
    this.myUserForm = this.fb.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, emailValidator],
      password: [null],
      phone: [null, phoneNumberValidator],
      team: [null],
      roles: [null, Validators.required],
      userStatus: ['active'],
      settings: new FormGroup({
        summarySettings: new FormGroup({
          frequency: new FormControl(),
          day: new FormControl()
        })
      })
    });
  }

  get isValid(): boolean {
    if (!this.myUserForm.valid) {
      this.myUserFormValidatorService.validateAllFormFields(this.myUserForm);
      return false;
    }
    return true;
  }
}
