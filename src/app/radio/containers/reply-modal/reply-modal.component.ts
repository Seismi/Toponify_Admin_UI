import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';

@Component({
  selector: 'smi-reply-modal',
  templateUrl: './reply-modal.component.html',
  styleUrls: ['./reply-modal.component.scss'],
  providers: [RadioDetailService, RadioValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class ReplyModalComponent implements OnInit {
  replyMode = true;
  radio: any;

  constructor(
    private radioDetailService: RadioDetailService,
    public dialogRef: MatDialogRef<ReplyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.radio = data.radio;
  }

  ngOnInit() {}

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  onSubmit() {
    this.dialogRef.close({ radio: this.radioDetailsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
