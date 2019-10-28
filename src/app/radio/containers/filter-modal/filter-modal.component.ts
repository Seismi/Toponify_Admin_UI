import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'smi-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})

export class FilterModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }
    
  onSubmit() { 
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
