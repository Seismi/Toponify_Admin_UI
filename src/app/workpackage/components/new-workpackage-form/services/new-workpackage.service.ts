import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewWorkpackageValidatorService } from './new-workpackage-validator.service';

@Injectable()
export class NewWorkpackageService {

  public newWorkpackageForm: FormGroup;

  constructor(private fb: FormBuilder, private newWorkpackageValidatorService: NewWorkpackageValidatorService) {
    this.newWorkpackageForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      owners: this.fb.array([this.OwnersOrApprovers()]),
      approvers: this.fb.array([this.OwnersOrApprovers()]),
      status: ['approved']
    });
  }

  OwnersOrApprovers(): FormGroup {
    return this.fb.group({
      name: [null]
    });
  }

  get isValid(): boolean {
    if (!this.newWorkpackageForm.valid) {
      this.newWorkpackageValidatorService.validateAllFormFields(this.newWorkpackageForm);
      return false;
    }
    return true;
  }
}