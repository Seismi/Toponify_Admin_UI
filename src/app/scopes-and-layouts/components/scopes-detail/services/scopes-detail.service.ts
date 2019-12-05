import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScopesValidatorService } from './scopes-detail-validator.service';

@Injectable()
export class ScopesDetailService {
  public scopesDetailForm: FormGroup;

  constructor(private fb: FormBuilder, private scopesValidatorService: ScopesValidatorService) {
    this.scopesDetailForm = this.fb.group({
      name: [null, Validators.required],
      owners: this.fb.array([this.OwnersOrViewers()]),
      viewers: this.fb.array([this.OwnersOrViewers()]),
      layerFilter: [null]
    });
  }

  OwnersOrViewers(): FormGroup {
    return this.fb.group({
      name: [null],
      type: [null]
    });
  }

  get isValid(): boolean {
    if (!this.scopesDetailForm.valid) {
      this.scopesValidatorService.validateAllFormFields(this.scopesDetailForm);
      return false;
    }
    return true;
  }
}
