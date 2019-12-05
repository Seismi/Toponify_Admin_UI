import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterRadioFormValidatorService } from './filter-radio-form-validator.service';

@Injectable()
export class FilterRadioFormService {
  public filterRadioForm: FormGroup;

  constructor(private fb: FormBuilder, private filterRadioFormValidatorService: FilterRadioFormValidatorService) {
    this.filterRadioForm = this.fb.group({
      status: [null],
      type: [null],
      assignedTo: [null],
      relatesTo: [null],
      from: [null],
      to: [null],
      text: [null]
    });
  }

  get isValid(): boolean {
    if (!this.filterRadioForm.valid) {
      this.filterRadioFormValidatorService.validateAllFormFields(this.filterRadioForm);
      return false;
    }
    return true;
  }
}
