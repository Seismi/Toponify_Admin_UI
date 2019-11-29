import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { validateAllFormFields } from '@app/services/utils';

@Injectable()
export class ReportLibraryDetailService {
  public reportDetailForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reportDetailForm = this.fb.group({
      name: [null, Validators.required],
      description: [null]
    });
  }

  get isValid(): boolean {
    if (!this.reportDetailForm.valid) {
      validateAllFormFields(this.reportDetailForm);
      return false;
    }
    return true;
  }
}
