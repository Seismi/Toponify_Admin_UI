import { Component, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';
import { AddRadio } from '@app/radio/store/models/radio.model';

@Component({
  selector: 'smi-radio-modal',
  templateUrl: './radio-modal.component.html',
  styleUrls: ['./radio-modal.component.scss'],
  providers: [RadioDetailService, RadioValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class RadioModalComponent {

  @Input() addComment = false;
  @Input() isEditable = true;
  radio: AddRadio;

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  constructor(
    private radioDetailService: RadioDetailService,
    public dialogRef: MatDialogRef<RadioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.radio = data.radio;
    }

  onSubmit() {
    if (!this.radioDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ comment: this.radioDetailsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}