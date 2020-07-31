import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { WorkPackagesActive } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-add-objective-modal',
  templateUrl: './move-objective-modal.component.html',
  styleUrls: ['./move-objective-modal.component.scss']
})
export class MoveObjectiveModalComponent {
  control = new FormControl();
  workPackages: WorkPackagesActive[];

  constructor(
    private dialogRef: MatDialogRef<MoveObjectiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkPackagesActive[]) { this.workPackages = data; }

  onConfirm(): void {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
