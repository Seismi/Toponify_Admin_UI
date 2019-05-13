import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioValidatorService } from './radio-detail-validator.service';

@Injectable()
export class RadioDetailService {

  public radioDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private radioValidatorService: RadioValidatorService) {
    this.radioDetailsForm = this.fb.group({
      title: [null, Validators.required],
      category: [null, Validators.required],
      status: [null, Validators.required],
      targetName: [null],
      commentText: [null, Validators.required],
      replyText: [null],
      author: this.fb.array([this.author()]),
      replies: this.fb.array([this.replies()])
    });
  }

  // FIXME: Need userId from the token
  author(): FormGroup {
    return this.fb.group({
      userId: ['bd7f2626-c07c-4e61-b0d8-fdf48a58c3db']
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