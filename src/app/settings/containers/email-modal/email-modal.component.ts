import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.scss']
})
export class EmailModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EmailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  @ViewChild('input') input: ElementRef;

  ngOnInit(): void { }

  onSave(): void {
    this.dialogRef.close({ value: this.input.nativeElement.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
