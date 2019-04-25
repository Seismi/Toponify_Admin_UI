import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentValidatorService } from './comments-detail-validator.service';

@Injectable()
export class CommentsDetailService {

  public commentDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private commentValidatorService: CommentValidatorService) {
    this.commentDetailsForm = this.fb.group({
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
    if (!this.commentDetailsForm.valid) {
      this.commentValidatorService.validateAllFormFields(this.commentDetailsForm);
      return false;
    }
    return true;
  }
  
}