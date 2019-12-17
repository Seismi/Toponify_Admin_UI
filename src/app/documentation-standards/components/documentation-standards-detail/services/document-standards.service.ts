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

  getPropertyValueValidator(type: string, reg: string): string {
    if (type === 'Text') {
      reg = null;
    } else if (type === 'Number') {
      reg = '^[0-9]{0,50}$';
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

  updateForm(documentStandard: DocumentStandard): void {
    this.documentStandardsForm = this.fb.group({
      name: [documentStandard.name, Validators.required],
      description: [documentStandard.description],
      type: [documentStandard.type, Validators.required],
      levels: [documentStandard.levels || []]
    });
  }
}
