import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentStandardsValidatorService } from './document-standards-validator.service';;

@Injectable()
export class DocumentStandardsService {

  public documentStandardsForm: FormGroup;

  constructor(private fb: FormBuilder, private documentStandardsValidatorService: DocumentStandardsValidatorService) {
    this.documentStandardsForm = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      type: [null, Validators.required],
      levels: [null]
    });
  }

  getPropertyValueValidator(type: string, reg: any) {
    if (type === 'Text') {
      reg = '[a-zA-Z ]*';
    } else if (type === 'Number') {
      reg = '^[0-9]{0,50}$';
    } else if (type === 'Boolean') {
      reg = '(true|false)*';
    } else if (type === 'Hyperlink') {
      reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    }
    return reg;
  }

  get isValid(): boolean {
    if (!this.documentStandardsForm.valid) {
      this.documentStandardsValidatorService.validateAllFormFields(this.documentStandardsForm);
      return false;
    }
    return true;
  }
}