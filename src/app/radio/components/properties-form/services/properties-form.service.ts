import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PropertiesFormValidatorService } from './properties-form-validator.service';

@Injectable()
export class PropertiesFormService {
  public propertiesForm: FormGroup;

  constructor(private fb: FormBuilder, private propertiesFormValidatorService: PropertiesFormValidatorService) {
    this.propertiesForm = this.fb.group({
      value: [null]
    });
  }

  getValueValidation(type: string): string {
    switch(type) {
      case 'Text':
        return null;
      case 'Number':
        return '^[0-9]{0,50}$';
      case 'Hyperlink':
        return '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    }
  }

  get isValid(): boolean {
    if (!this.propertiesForm.valid) {
      this.propertiesFormValidatorService.validateAllFormFields(this.propertiesForm);
      return false;
    }
    return true;
  }
}