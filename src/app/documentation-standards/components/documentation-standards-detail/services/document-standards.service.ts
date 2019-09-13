import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentStandardsValidatorService } from './document-standards-validator.service';

@Injectable()
export class DocumentStandardsService {

  public documentStandardsForm: FormGroup;

  constructor(private fb: FormBuilder, private documentStandardsValidatorService: DocumentStandardsValidatorService) {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.documentStandardsForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      type: [null, Validators.required],
      levels: [null],
      value: [null, [Validators.pattern(reg)]],
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