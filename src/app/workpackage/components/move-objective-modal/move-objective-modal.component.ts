import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-add-objective-modal',
  templateUrl: './move-objective-modal.component.html',
  styleUrls: ['./move-objective-modal.component.scss']
})
export class MoveObjectiveModalComponent {
  control = new FormControl();
  workPackages: WorkPackageEntity[];

  constructor(
    private dialogRef: MatDialogRef<MoveObjectiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkPackageEntity[]
  ) {
    this.workPackages = data;
  }

  onConfirm() {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
