import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VersionValidatorService } from './version-form-validator.service';


@Injectable()
export class VersionFormService {
  public versionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private versionValidatorsService: VersionValidatorService
  ) {
    this.versionForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      description: [null],
      status: ['active'],
      isCopy: [null],
      copyFromId: [null]
    });
  }

  get isValid(): boolean {
    if (!this.versionForm.valid) {
      this.versionValidatorsService.validateAllFormFields(this.versionForm);
      return false;
    }
    return true;
  }
  
}
