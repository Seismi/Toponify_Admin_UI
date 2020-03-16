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
      baseline: [null],
      owners: [null, Validators.required],
      status: ['draft']
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
