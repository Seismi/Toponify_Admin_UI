import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkPackageValidatorService } from './workpackage-detail-validator.service';

@Injectable()
export class WorkPackageDetailService {

  public workPackageDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private workPackageValidatorService: WorkPackageValidatorService) {
    this.workPackageDetailForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      owners: this.fb.array([this.OwnersOrApprovers()]),
      approvers: this.fb.array([this.OwnersOrApprovers()]),
      status: [null, Validators.required]
    });
  }

  OwnersOrApprovers(): FormGroup {
    return this.fb.group({
      id: [null],
      name: [null],
      type: [null]
    });
  }

  get isValid(): boolean {
    if (!this.workPackageDetailForm.valid) {
      this.workPackageValidatorService.validateAllFormFields(this.workPackageDetailForm);
      return false;
    }
    return true;
  }
}