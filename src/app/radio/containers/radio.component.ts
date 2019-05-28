import { Component, OnInit } from '@angular/core';
import { RadioDetailService } from '../components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../components/radio-detail/services/radio-detail-validator.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { RadioModalComponent } from './radio-modal/radio-modal.component';
import { ReplyModalComponent } from './reply-modal/reply-modal.component';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
// import * as fromRadio from '../store/reducers'
import * as RadioActions from '../store/actions/radio.actions';
import { Radio } from '../store/models/radio.model';
import { RadioState } from '../store/reducers/radio.reducer';
import { getRadio, getRadioLoading } from '../store/selectors/radio.selector';


@Component({
    selector: 'smi-radio',
    templateUrl: 'radio.component.html',
    styleUrls: ['radio.component.scss'],
    providers: [RadioDetailService, RadioValidatorService]
})
export class RadioComponent implements OnInit {

    radio$: Observable<Radio[]>;
    loading$: Observable<boolean>;

    disableButton = true;
    isEditable = false;
    addComment = true;
    radioPage = true;

    constructor(private store: Store<RadioState>,
                private radioDetailService: RadioDetailService,
                public dialog: MatDialog) { }

    ngOnInit() {
        this.store.dispatch(new RadioActions.LoadRadio());
        this.radio$ = this.store.pipe(select(getRadio));
        this.loading$ = this.store.pipe(select(getRadioLoading));
    }

    get radioDetailsForm(): FormGroup {
        return this.radioDetailService.radioDetailsForm;
    }

    onSelectedRow(row) {
        this.radioDetailService.radioDetailsForm.patchValue({
            title: row.title,
            category: row.category,
            status: row.status,
            commentText: row.commentText
        })

        this.addComment = true;
        this.disableButton = false;
    }

    onAddComment() {
        this.isEditable = false;
        const dialogRef = this.dialog.open(RadioModalComponent, {
            disableClose: false,
            width: 'auto'
        });

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
    }

    onSaveComment() {
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
    }

    onArchiveComment() {
        const dialogRef = this.dialog.open(ReplyModalComponent, {
            disableClose: false,
            width: '400px'
        });

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
    }

    

}