import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})

export class DeleteModalComponent {

    mode: string;

    constructor(
        public dialogRef: MatDialogRef<DeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.mode = data.mode;
            this.mode === 'delete';
        }

    onYes(){
        this.dialogRef.close({mode: this.mode});
    }
    
    onNo(): void {
        this.dialogRef.close({mode: 'cancel'});
    }
}