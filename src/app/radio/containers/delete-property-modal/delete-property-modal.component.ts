import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-delete-property-modal',
  templateUrl: './delete-property-modal.component.html',
  styleUrls: ['./delete-property-modal.component.scss']
})
export class DeleteRadioPropertyModalComponent {

  mode: string;
  name: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteRadioPropertyModalComponent>,
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