import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'smi-edit-name-modal',
  templateUrl: './edit-name-modal.component.html',
  styleUrls: ['./edit-name-modal.component.scss']
})
export class EditNameModalComponent {
  public nameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditNameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.nameForm = this.fb.group({
      name: [data.name, Validators.required]
    });
  }

  onSubmit() {
    if (this.nameForm.valid) {
      this.dialogRef.close(this.nameForm.value);
    }
  }
}
