import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'smi-delete-document-modal',
    templateUrl: './delete-document.component.html',
    styleUrls: ['./delete-document.component.scss']
})
export class DeleteDocumentModalComponent {

    mode: string;

    constructor(
        public dialogRef: MatDialogRef<DeleteDocumentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.mode = data.mode;
        this.mode === 'delete';
    }

    onYes() {
        this.dialogRef.close({ mode: this.mode });
    }

    onNo(): void {
        this.dialogRef.close({ mode: 'cancel' });
    }
    
}