import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'smi-save-layout-modal',
  templateUrl: './save-layout-modal.component.html',
  styleUrls: ['./save-layout-modal.component.scss']
})
export class SaveLayoutModalComponent {
  public nameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SaveLayoutModalComponent>,
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
