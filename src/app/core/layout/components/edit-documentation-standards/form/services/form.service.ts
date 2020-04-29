import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditDocumentationStandardsFormValidatorService } from './form-validator.service';

@Injectable()
export class EditDocumentationStandardsFormService {
  public editDocumentationStandardsForm: FormGroup;

  constructor(
      private fb: FormBuilder,
      private editDocumentationStandardsFormValidatorService: EditDocumentationStandardsFormValidatorService
    ) {
    this.editDocumentationStandardsForm = this.fb.group({
      value: [null]
    });
  }

  getValueValidation(type: string): string | RegExp {
    switch (type) {
      case 'Text':
        return null;
      case 'Number':
        return /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
      case 'Hyperlink':
        return /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    }
  }

  get isValid(): boolean {
    if (!this.editDocumentationStandardsForm.valid) {
      this.editDocumentationStandardsFormValidatorService.validateAllFormFields(this.editDocumentationStandardsForm);
      return false;
    }
    return true;
  }
}
