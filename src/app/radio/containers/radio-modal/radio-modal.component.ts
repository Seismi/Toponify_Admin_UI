import { Component, Inject, OnInit, OnDestroy, DoCheck } from '@angular/core';
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
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { getSelectedWorkpackages } from '@app/workpackage/store/selectors/workpackage.selector';
import { LoadUsers } from '@app/settings/store/actions/user.actions';

@Component({
  selector: 'smi-radio-modal',
  templateUrl: './radio-modal.component.html',
  styleUrls: ['./radio-modal.component.scss'],
  providers: [RadioDetailService, RadioValidatorService]
})
export class RadioModalComponent implements OnInit, OnDestroy {
  public users$: Observable<User[]>;
  public isEditable = true;
  public modalMode = true;
  public radio: RadioDetail;
  public workpackages$: Observable<WorkPackageEntity[]>;
  public selectedOption: any;
  public selectWorkPackages = false;
  public message: string;

  constructor(
    private store: Store<UserState>,
    private radioDetailService: RadioDetailService,
    public dialogRef: MatDialogRef<RadioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectWorkPackages = data.selectWorkPackages;
      this.message = data.message;
    }

  ngOnInit() {
    this.store.dispatch(new LoadUsers({}));
    this.users$ = this.store.pipe(select(getUsers));
    if (this.data.selectWorkPackages) {
      this.workpackages$ = this.store.pipe(select(getSelectedWorkpackages));
    }
    this.radioDetailsForm.patchValue({
      severity: 3,
      frequency: 3
    });
  }

  ngOnDestroy(): void {
    this.selectedOption = [];
  }

  get radioDetailsForm(): FormGroup {
    return this.radioDetailService.radioDetailsForm;
  }

  onSubmit() {
    if (!this.radioDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ radio: this.radioDetailsForm.value, selectedWorkPackages: this.selectedOption });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelectWorkPackage($event) {
    this.selectedOption = $event;
  }
}
