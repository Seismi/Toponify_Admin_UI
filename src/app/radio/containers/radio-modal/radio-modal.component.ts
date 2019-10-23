import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { RadioDetailService } from '@app/radio/components/radio-detail/services/radio-detail.service';
import { RadioValidatorService } from '@app/radio/components/radio-detail/services/radio-detail-validator.service';
import { RadioDetail } from '@app/radio/store/models/radio.model';
import { Observable } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { getUsers } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'smi-radio-modal',
  templateUrl: './radio-modal.component.html',
  styleUrls: ['./radio-modal.component.scss'],
  providers: [RadioDetailService, RadioValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class RadioModalComponent implements OnInit {

  public users$: Observable<User[]>;
  public isEditable = true;
  public modalMode = true;
  public radio: RadioDetail;

  constructor(
    private store: Store<UserState>,
    private radioDetailService: RadioDetailService,
    public dialogRef: MatDialogRef<RadioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.radio = data.radio;
    }

  ngOnInit() {
    this.users$ = this.store.pipe(select(getUsers));
  }
    
  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  onSubmit(data: any) {
    if (!this.radioDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ radio: this.radioDetailsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}
