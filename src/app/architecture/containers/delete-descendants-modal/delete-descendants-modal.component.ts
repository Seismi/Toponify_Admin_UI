import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-delete-descendants-modal',
  templateUrl: './delete-descendants-modal.component.html',
  styleUrls: ['./delete-descendants-modal.component.scss']
})
export class DeleteDescendantsModalComponent {

  public mode: string;
  public name: string;

  constructor(public dialogRef: MatDialogRef<DeleteDescendantsModalComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.mode = data.mode;
      this.name = data.name;
  }

  onYes() {
    this.dialogRef.close({ mode: this.mode });
  }

  onNo(): void {
    this.dialogRef.close({ mode: 'cancel' });
  }
}