import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutsValidatorService } from './layouts-detail-validator.service';

@Injectable()
export class LayoutsDetailService {

  public layoutsDetailForm: FormGroup;
  scopeId: string;
  scopeName: string;

  constructor(private fb: FormBuilder, private layoutsValidatorService: LayoutsValidatorService) {
    this.layoutsDetailForm = this.fb.group({
      name: [null, Validators.required],
      owners: this.fb.array([this.OwnersOrViewers()]),
      viewers: this.fb.array([this.OwnersOrViewers()]),
    });
  }

  OwnersOrViewers(): FormGroup {
    return this.fb.group({
      name: [null],
      type: [null]
    });
  }

  get isValid(): boolean {
    if (!this.layoutsDetailForm.valid) {
      this.layoutsValidatorService.validateAllFormFields(this.layoutsDetailForm);
      return false;
    }
    return true;
  }
}