import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'smi-delete-scopes-and-layouts-modal',
    templateUrl: './delete-scopes-and-layouts.component.html',
    styleUrls: ['./delete-scopes-and-layouts.component.scss']
})
export class DeleteScopesAndLayoutsModalComponent {

    mode: string;

    constructor(
        public dialogRef: MatDialogRef<DeleteScopesAndLayoutsModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.mode = data.mode;
        this.mode === 'delete';
    }

    onYes() {
        this.dialogRef.close({ mode: this.mode });
    }

    onNo(): void {
        this.dialogRef.close({ mode: 'cancel'});
    }

}