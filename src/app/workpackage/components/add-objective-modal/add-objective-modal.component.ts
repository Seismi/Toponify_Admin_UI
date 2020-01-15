import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'smi-add-objective-modal',
  templateUrl: './add-objective-modal.component.html',
  styleUrls: ['./add-objective-modal.component.scss']
})
export class AddObjectiveModalComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddObjectiveModalComponent>, private fb: FormBuilder) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onConfirm() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
