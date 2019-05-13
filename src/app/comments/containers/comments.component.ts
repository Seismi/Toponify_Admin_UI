// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Store } from '@ngrx/store';
//import * as CommentActions from '../store/actions/comment.actions';
// import { select } from '@ngrx/store';
// import { Observable, Subscription } from 'rxjs';
//import * as fromComment from '../store/reducer';
//import { FormGroup } from '@angular/forms';
//import { CommentsDetailService } from '../components/comments-detail/services/comments-detail.service';
// import { ActivatedRoute } from '@angular/router';
// import { MatDialog } from '@angular/material';
//import { CommentValidatorService } from '../components/comments-detail/services/comments-detail-validator.service';
//import { Comment } from '../store/models/comment.model';
//import { ReplyCommentModalComponent } from '../../radio/containers/reply-comment-modal/reply-comment-modal.component';

// @Component({
//   selector: 'app-comments',
//   templateUrl: 'comments.component.html',
//   styleUrls: ['comments.component.scss'],
  //providers: [CommentsDetailService, CommentValidatorService]
// })
// export class CommentsComponent implements OnInit {

//   ngOnInit() {}

  // @ViewChild(CommentsTableComponent) commentsTable: CommentsTableComponent;

  // comments$: Observable<any>;
  // loading$: Observable<boolean>;
  // versionId$: Subscription;
  // comment: Comment;
  // versionId: string;
  // commentId: string;
  // addComment = true;
  // isEditable = false;
  // disableButton = true;
  // selectedComment$: Subscription;
  // selecetedComment: Comment;

  // get commentDetailsForm(): FormGroup {
  //   return this.commentsDetailService.commentDetailsForm;
  // }

  // constructor(private store: Store<fromComment.CommentState>,
  //             private commentsDetailService: CommentsDetailService,
  //             private route: ActivatedRoute,
  //             public dialog: MatDialog) {}

  // ngOnInit() {
  //   this.versionId$ = this.route.params.subscribe((params) => {
  //     this.versionId = params['id']
  //     if(this.versionId){
  //       this.store.dispatch(new CommentActions.LoadComments(this.versionId));
  //       this.loading$ = this.store.pipe(select(fromComment.getLoading));
  //       this.comments$ = this.store.pipe(select(fromComment.getComments));
  //     }
  //   }
  // )}

  // // FIXME: Think we should put the selected comment in the store
  // onSelectedRow(row) {
  //   this.commentsDetailService.commentDetailsForm.patchValue({
  //     title: row.title,
  //     category: row.category,
  //     status: row.status,
  //     targetName: row.lastUpdatedBy.firstName,
  //     commentText: row.commentText
  //   })

  //   this.commentId = row.id;
  //   this.addComment = true;
  //   this.disableButton = false;

  //   // Call reply comments
  //   this.store.dispatch(new CommentActions.LoadReplyComments({
  //     versionId: this.versionId, 
  //     commentId: this.commentId
  //   }));

  //   this.selectedComment$ = this.store.pipe(select(fromComment.getCommentById(this.commentId))).subscribe((data)=> {
  //     this.selecetedComment = {...data[0]}
  //   })
  // }
  
  // onSearchComments(filterValue: string) {
  //   // this.commentsTable.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // onAddComment() {
  //   this.isEditable = false;
  //   const dialogRef = this.dialog.open(CommentModalComponent, {
  //     disableClose: false,
  //     width: 'auto'
  //   });

  //   dialogRef.afterClosed().subscribe((data) => {
  //     this.addComment = true;
  //       this.store.dispatch(new CommentActions.AddComment({
  //         versionId: this.versionId, 
  //         comment: {
  //           data: {
  //             title: data.comment.title,
  //             category: data.comment.category,
  //             status: data.comment.status,
  //             commentText: data.comment.commentText,
  //             author: { userId: 'bd7f2626-c07c-4e61-b0d8-fdf48a58c3db' }
  //           }
  //       }}))
  //   })
  // }

  // onSaveComment() {
  //   const dialogRef = this.dialog.open(ReplyCommentModalComponent, {
  //     disableClose: false,
  //     width: '400px'
  //   });

  //   dialogRef.afterClosed().subscribe((data) => {
  //     if(data){
  //       this.store.dispatch(new CommentActions.ReplyComment({
  //         versionId: this.versionId, 
  //         commentId: this.commentId, 
  //         comment: {
  //           data: {
  //             replyText: data.comment.replyText,
  //             changes: this.commentDetailsForm.value,
  //             author: { userId: 'bd7f2626-c07c-4e61-b0d8-fdf48a58c3db' }
  //           }
  //       }}))
  //     }
  //   })
  // }

  // onArchiveComment() {
  //   const dialogRef = this.dialog.open(ReplyCommentModalComponent, {
  //     disableClose: false,
  //     width: '400px'
  //   });

  //   dialogRef.afterClosed().subscribe((data) => {
  //     this.store.dispatch(new CommentActions.ArchiveComment({
  //       versionId: this.versionId, 
  //       commentId: this.commentId, 
  //       comment: {
  //         data: {
  //           replyText: data.comment.replyText,
  //           changes: { status: 'closed' },
  //           author: { userId: 'bd7f2626-c07c-4e61-b0d8-fdf48a58c3db' }
  //         }
  //     }}))
  //   })
  // }
//}
