import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-radio-confirm-modal',
  templateUrl: './radio-confirm-modal.component.html',
  styleUrls: ['./radio-confirm-modal.component.scss']
})
export class RadioConfirmModalComponent implements OnInit {
  public workpackage = new FormControl();
  public selectedWorkPackages: WorkPackageEntity[];

  constructor(
    public dialogRef: MatDialogRef<RadioConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectedWorkPackages = data.selectedWorkPackages
    }

  ngOnInit(): void { }

  onSave(): void {
    this.dialogRef.close({ workpackages: this.workpackage.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}