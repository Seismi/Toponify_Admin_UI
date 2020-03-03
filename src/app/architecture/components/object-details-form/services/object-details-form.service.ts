import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectDetailsValidatorService } from './object-details-form-validator.service';

@Injectable()
export class ObjectDetailsService {
  public objectDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private objectDetailsValidatorService: ObjectDetailsValidatorService) {
    this.objectDetailsForm = this.fb.group({
      name: [null, Validators.required],
      category: [null],
      reference: [null],
      owner: [null],
      description: [null],
      tags: [null],
      directDependencies: [null]
    });
  }

  get isValid(): boolean {
    if (!this.objectDetailsForm.valid) {
      this.objectDetailsValidatorService.validateAllFormFields(this.objectDetailsForm);
      return false;
    }
    return true;
  }

  updateForm(object) {
    this.objectDetailsForm = this.fb.group({
      name: [object && object.name ? object.name : null, Validators.required],
      category: [object && object.category ? object.category : null],
      reference: [object && object.reference ? object.reference : null, Validators.required],
      owner: [null],
      description: [object && object.description ? object.description : null],
      tags: [object && object.tags ? object.tags : null],
      directDependencies: [null]
    });
  }
}
