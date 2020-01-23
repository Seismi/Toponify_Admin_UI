import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-delete-radio-modal',
  templateUrl: './delete-radio-modal.component.html',
  styleUrls: ['./delete-radio-modal.component.scss']
})
export class DeleteRadioModalComponent {
  public mode: string

  constructor(
    public dialogRef: MatDialogRef<DeleteRadioModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) { 
      this.mode = data.mode;
    }

  onYes(): void {
    this.dialogRef.close({ mode: this.mode });
  }

  onNo(): void {
    this.dialogRef.close({ mode: 'cancel' });
  }
}