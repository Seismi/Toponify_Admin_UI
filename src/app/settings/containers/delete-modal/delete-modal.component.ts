import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteTeamAndMemberModalComponent {

  mode: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamAndMemberModalComponent>,
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