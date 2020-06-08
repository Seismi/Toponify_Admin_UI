import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string,
      text: string,
      confirmBtn: string,
      cancelBtn: string,
      warningMessage: string
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close({ data: this.data });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
