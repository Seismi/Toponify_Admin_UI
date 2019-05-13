import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkpackageValidatorService } from './workpackage-detail-validator.service';

@Injectable()
export class WorkpackageDetailService {

  public workpackageDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private workpackageValidatorService: WorkpackageValidatorService) {
    this.workpackageDetailsForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      owners: this.fb.array([this.OwnersOrApprovers()]),
      approvers: this.fb.array([this.OwnersOrApprovers()])
    });
  }


  OwnersOrApprovers(): FormGroup {
    return this.fb.group({
      name: [null]
    });
  }


  get isValid(): boolean {
    if (!this.workpackageDetailsForm.valid) {
      this.workpackageValidatorService.validateAllFormFields(this.workpackageDetailsForm);
      return false;
    }
    return true;
  }
  
}