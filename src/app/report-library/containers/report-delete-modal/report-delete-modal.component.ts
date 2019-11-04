import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-report-delete-modal',
  templateUrl: './report-delete-modal.component.html',
  styleUrls: ['./report-delete-modal.component.scss']
})
export class ReportDeleteModalComponent {

  mode: string;
  name: string;

  constructor(
    public dialogRef: MatDialogRef<ReportDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mode = data.mode;
    this.name = data.name;
    this.mode === 'delete';
  }

  onYes() {
    this.dialogRef.close({ mode: this.mode });
  }

  onNo(): void {
    this.dialogRef.close({ mode: 'cancel' });
  }

}