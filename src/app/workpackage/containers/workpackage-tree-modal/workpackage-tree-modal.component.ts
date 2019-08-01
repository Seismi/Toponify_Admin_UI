import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'smi-workpackage-tree-modal',
  templateUrl: './workpackage-tree-modal.component.html',
  styleUrls: ['./workpackage-tree-modal.component.scss']
})

export class WorkPackageTreeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<WorkPackageTreeModalComponent>
  ) {}

  ngOnInit() { }

  onClose() {
    this.dialogRef.close();
  }

}