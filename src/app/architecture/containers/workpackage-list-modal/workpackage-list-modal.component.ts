import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'smi-workpackage-list-modal',
  templateUrl: './workpackage-list-modal.component.html',
  styleUrls: ['./workpackage-list-modal.component.scss']
})
export class WorkPackageListModalComponent implements OnInit {
  public workpackages$: Observable<WorkPackageEntity[]>;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<WorkPackageListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.form = this.fb.group({
        workpackages: [true]
      });
    }

  ngOnInit(): void {
    this.workpackages$ = this.store.pipe(select(getWorkPackageEntities));
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close({ wp: this.form.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
