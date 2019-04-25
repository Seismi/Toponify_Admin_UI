import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Comment } from '@app/comments/store/models/comment.model';
import { CommentsDetailService } from '@app/comments/components/comments-detail/services/comments-detail.service';
import { CommentValidatorService } from '@app/comments/components/comments-detail/services/comments-detail-validator.service';

@Component({
  selector: 'smi-reply-comment-modal',
  templateUrl: './reply-comment-modal.component.html',
  styleUrls: ['./reply-comment-modal.component.scss'],
  providers: [CommentsDetailService, CommentValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class ReplyCommentModalComponent implements OnInit {

  comment: Comment;

  constructor(private commentsDetailService: CommentsDetailService,
              public dialogRef: MatDialogRef<ReplyCommentModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.comment = data.comment;
              }
  
  ngOnInit() {}

  get commentDetailsForm(): FormGroup {
    return this.commentsDetailService.commentDetailsForm;
  }

  onSubmit() {
    this.dialogRef.close({ comment: this.commentDetailsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}