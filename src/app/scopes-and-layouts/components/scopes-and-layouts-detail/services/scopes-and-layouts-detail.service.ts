import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScopesAndLayoutsValidatorService } from './scopes-and-layouts-detail-validator.service';

@Injectable()
export class ScopesAndLayoutsDetailService {
  public scopesAndLayoutsDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private scopesAndLayoutsValidatorService: ScopesAndLayoutsValidatorService) {
    this.scopesAndLayoutsDetailForm = this.fb.group({
      name: [null, Validators.required],
      layerFilter: [null]
    });
  }

  get isValid(): boolean {
    if (!this.scopesAndLayoutsDetailForm.valid) {
      this.scopesAndLayoutsValidatorService.validateAllFormFields(this.scopesAndLayoutsDetailForm);
      return false;
    }
    return true;
  }
}
