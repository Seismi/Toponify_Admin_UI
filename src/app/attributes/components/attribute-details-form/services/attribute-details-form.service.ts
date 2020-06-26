import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributeDetailsFormValidationService } from './attribute-details-form-validator.service';

@Injectable()
export class AttributeDetailsFormService {
  public attributeDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private attributeDetailsFormValidationService: AttributeDetailsFormValidationService) {
    this.attributeDetailsForm = this.fb.group({
      reference: [null],
      name: [null, Validators.required],
      category: [null],
      description: [null],
      tags: [null]
    });
  }

  get isValid(): boolean {
    if (!this.attributeDetailsForm.valid) {
      this.attributeDetailsFormValidationService.validateAllFormFields(this.attributeDetailsForm);
      return false;
    }
    return true;
  }

  updateForm(object) {
    this.attributeDetailsForm = this.fb.group({
      reference: [object && object.reference ? object.reference : null, Validators.required],
      name: [object && object.name ? object.name : null, Validators.required],
      category: [object && object.category ? object.category : null],
      description: [object && object.description ? object.description : null],
      tags: [object && object.tags ? object.tags : null],
    });
  }
}
