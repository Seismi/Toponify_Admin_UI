import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewChildrenValidatorService } from './new-children-form-validator.service';

@Injectable()
export class NewChildrenService {
  public newChildrenForm: FormGroup;

  constructor(private fb: FormBuilder, private newChildrenValidatorService: NewChildrenValidatorService) {
    this.newChildrenForm = this.fb.group({
      category: [null, Validators.required],
      name: [null, Validators.required],
      description: [null]
    });
  }

  get isValid(): boolean {
    if (!this.newChildrenForm.valid) {
      this.newChildrenValidatorService.validateAllFormFields(this.newChildrenForm);
      return false;
    }
    return true;
  }
}
