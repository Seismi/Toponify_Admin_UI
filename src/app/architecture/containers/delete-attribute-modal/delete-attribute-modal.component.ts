import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-delete-attribute-modal',
  templateUrl: './delete-attribute-modal.component.html',
  styleUrls: ['./delete-attribute-modal.component.scss']
})
export class DeleteAttributeModalComponent implements OnInit {

  public type: string;
  public name: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteAttributeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.type = data.type;
      this.name = data.name;
    }

  ngOnInit(): void {}

  onSubmit(): void {
    this.dialogRef.close({attribute: this.data});
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}