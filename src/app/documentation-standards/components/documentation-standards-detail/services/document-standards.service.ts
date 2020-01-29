import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentStandardsValidatorService } from './document-standards-validator.service';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

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

  get isValid(): boolean {
    if (!this.documentStandardsForm.valid) {
      this.documentStandardsValidatorService.validateAllFormFields(this.documentStandardsForm);
      return false;
    }
    return true;
  }

  updateForm(documentStandard: DocumentStandard): void {
    this.documentStandardsForm = this.fb.group({
      name: [documentStandard.name, Validators.required],
      description: [documentStandard.description],
      type: [documentStandard.type, Validators.required],
      levels: [documentStandard.levels || []]
    });
  }
}
