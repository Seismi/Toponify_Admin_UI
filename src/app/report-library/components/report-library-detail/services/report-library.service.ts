import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReportLibraryValidatorService } from './report-library-validator.service';

@Injectable()
export class ReportLibraryDetailService {

  public reportDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private reportLibraryValidatorService: ReportLibraryValidatorService) {
    this.reportDetailForm = this.fb.group({
      name: [null],
      description: [null]
    });
  }

  get isValid(): boolean {
    if (!this.reportDetailForm.valid) {
      this.reportLibraryValidatorService.validateAllFormFields(this.reportDetailForm);
      return false;
    }
    return true;
  }
}