import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteTeamAndMemberModalComponent {
  public mode: string;
  public name: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamAndMemberModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.name = data.name;
  }

  onYes(): void {
    this.dialogRef.close({ mode: this.mode });
  }

  onNo(): void {
    this.dialogRef.close({ mode: 'cancel' });
  }
}
