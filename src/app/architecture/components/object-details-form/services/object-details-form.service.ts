import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectDetailsValidatorService } from './object-details-form-validator.service';

@Injectable()
export class ObjectDetailsService {
  public objectDetailsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private objectDetailsValidatorService: ObjectDetailsValidatorService
  ) {
    this.objectDetailsForm = this.fb.group({
      name: [null, Validators.required],
      category: [null],
      owner: [null],
      description: [null],
      tags: [null],
      directDependencies: [null]
    });
  }

  get isValid(): boolean {
    if (!this.objectDetailsForm.valid) {
      this.objectDetailsValidatorService.validateAllFormFields(
        this.objectDetailsForm
      );
      return false;
    }
    return true;
  }
}
