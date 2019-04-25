import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { CommentsDetailService } from '../comments-detail/services/comments-detail.service';
import { CommentValidatorService } from '../comments-detail/services/comments-detail-validator.service';
import { Comment } from '@app/comments/store/models/comment.model';
import { Store } from '@ngrx/store';
import * as fromComment from '../../store/reducer';
import * as CommentActions from '../../store/actions/comment.actions';

@Component({
  selector: 'smi-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [CommentsDetailService, CommentValidatorService]
})

export class ChatboxComponent {

  @Input() disableButton = true;
  @Input() group: FormGroup;
  @Input() versionId: string;
  @Input() commentId: string;

  constructor(private commentsDetailService: CommentsDetailService,
              private store: Store<fromComment.CommentState>) {}


  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  get commentDetailsForm(): FormGroup {
    return this.commentsDetailService.commentDetailsForm;
  }

  displayedColumns: string[] = ['title'];
  public dataSource: MatTableDataSource<Comment>;

  onSend() {
    this.store.dispatch(new CommentActions.ReplyComment({
      versionId: this.versionId, 
      commentId: this.commentId,
      comment: {
        data: {
          replyText: this.commentDetailsForm.value.replyText,
          author: { userId: 'bd7f2626-c07c-4e61-b0d8-fdf48a58c3db' }
        }
      }
    }))

    this.commentDetailsForm.patchValue({ replyText: '' });
  }

}