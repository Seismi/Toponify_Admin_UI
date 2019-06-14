import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-delete-team-modal',
  templateUrl: './delete-team-modal.component.html',
  styleUrls: ['./delete-team-modal.component.scss']
})
export class DeleteTeamModalComponent {

  mode: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.mode = data.mode;
      this.mode === 'delete';
    }

    onYes() {
        this.dialogRef.close({mode: this.mode});
    }

    onNo() {
        this.dialogRef.close({mode: 'cancel'});
    }

}