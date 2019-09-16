import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'smi-delete-workpackage-modal',
    templateUrl: './delete-workpackage.component.html',
    styleUrls: ['./delete-workpackage.component.scss']
})
export class DeleteWorkPackageModalComponent {

    mode: string;
    name: string;

    constructor(
        public dialogRef: MatDialogRef<DeleteWorkPackageModalComponent>,
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