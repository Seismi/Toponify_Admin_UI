import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '../radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '../radio-detail/services/radio-detail-validator.service';


@Component({
  selector: 'smi-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})

export class ChatBoxComponent {

  @Input() disableButton = true;
  @Input() group: FormGroup;
  @Input() versionId: string;
  @Input() commentId: string;

  constructor(private radioDetailService: RadioDetailService) {}


  // @Input()
  // set data(data: any[]) {
  //   this.dataSource = new MatTableDataSource<any>(data);
  // }

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  // displayedColumns: string[] = ['title'];
  // public dataSource: MatTableDataSource<Comment>;

  onSend() {
    // this.store.dispatch(new CommentActions.ReplyComment({
    //   versionId: this.versionId, 
    //   commentId: this.commentId,
    //   comment: {
    //     data: {
    //       replyText: this.radioDetailsForm.value.replyText,
    //       author: { userId: 'bd7f2626-c07c-4e61-b0d8-fdf48a58c3db' }
    //     }
    //   }
    // }))

    this.radioDetailsForm.patchValue({ replyText: '' });
  }

}