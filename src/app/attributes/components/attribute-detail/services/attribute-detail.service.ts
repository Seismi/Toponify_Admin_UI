import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttributeValidatorService } from './attribute-detail-validator.service';

@Injectable()
export class AttributeDetailService {

  public attributeDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private attributeValidatorService: AttributeValidatorService) {
    this.attributeDetailForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      owner: this.fb.array([this.Owner()]),
      tags: [null]
    });
  }

  Owner(): FormGroup {
    return this.fb.group({
      id: [null],
      name: [null],
      type: [null]
    });
  }

  get isValid(): boolean {
    if (!this.attributeDetailForm.valid) {
      this.attributeValidatorService.validateAllFormFields(this.attributeDetailForm);
      return false;
    }
    return true;
  }
}