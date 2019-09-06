import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioValidatorService } from './radio-detail-validator.service';

@Injectable()
export class RadioDetailService {

  public radioDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private radioValidatorService: RadioValidatorService) {
    this.radioDetailsForm = this.fb.group({
      title: [null, Validators.required],
      category: ['risk'],
      status: ['open'],
      mitigation: [null],
      assignedTo: [null],
      actionBy: [null],
      description: [null, Validators.required],
      replyText: [null],
      author: this.fb.array([this.author()]),
      replies: this.fb.array([this.replies()])
    });
  }

  author(): FormGroup {
    return this.fb.group({
      id: [null]
    });
  }

  replies(): FormGroup {
    return this.fb.group({
      id: [null],
      replyText: [null],
      postedOn: [null]
    });
  }

  get isValid(): boolean {
    if (!this.radioDetailsForm.valid) {
      this.radioValidatorService.validateAllFormFields(this.radioDetailsForm);
      return false;
    }
    return true;
  }
}