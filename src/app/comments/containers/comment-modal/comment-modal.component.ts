import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CommentsDetailService } from '../../components/comments-detail/services/comments-detail.service';
import { CommentValidatorService } from '@app/comments/components/comments-detail/services/comments-detail-validator.service';
import { AddComment } from '@app/comments/store/models/comment.model';

@Component({
  selector: 'smi-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
  providers: [CommentsDetailService, CommentValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class CommentModalComponent {

  @Input() addComment = false;
  @Input() isEditable = true;
  comment: AddComment;

  get commentDetailsForm(): FormGroup {
    return this.commentsDetailService.commentDetailsForm;
  }

  constructor(
    private commentsDetailService: CommentsDetailService,
    public dialogRef: MatDialogRef<CommentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.comment = data.comment;
    }

  onSubmit() {
    if (!this.commentsDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ comment: this.commentDetailsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}
