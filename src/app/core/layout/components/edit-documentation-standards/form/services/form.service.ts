import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditDocumentationStandardsFormValidatorService } from './form-validator.service';

@Injectable()
export class EditDocumentationStandardsFormService {
  public editDocumentationStandardsForm: FormGroup;

  constructor(private fb: FormBuilder, private editDocumentationStandardsFormValidatorService: EditDocumentationStandardsFormValidatorService) {
    this.editDocumentationStandardsForm = this.fb.group({
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
    if (!this.editDocumentationStandardsForm.valid) {
      this.editDocumentationStandardsFormValidatorService.validateAllFormFields(this.editDocumentationStandardsForm);
      return false;
    }
    return true;
  }
}