import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentStandardsValidatorService } from './document-standards-validator.service';

@Injectable()
export class DocumentStandardsService {

  public documentStandardsForm: FormGroup;

  constructor(private fb: FormBuilder, private documentStandardsValidatorService: DocumentStandardsValidatorService) {
    this.documentStandardsForm = this.fb.group({
      name: [null],
      description: [null],
      type: [null],
      levels: [null]
    });
  }

  get isValid(): boolean {
    if (!this.documentStandardsForm.valid) {
      this.documentStandardsValidatorService.validateAllFormFields(this.documentStandardsForm);
      return false;
    }
    return true;
  }
}