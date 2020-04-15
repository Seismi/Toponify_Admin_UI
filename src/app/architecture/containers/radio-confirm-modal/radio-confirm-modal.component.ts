import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import {currentArchitecturePackageId, WorkPackageEntity} from '@app/workpackage/store/models/workpackage.models';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { getWorkPackageEntities } from '@app/workpackage/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-radio-confirm-modal',
  templateUrl: './radio-confirm-modal.component.html',
  styleUrls: ['./radio-confirm-modal.component.scss']
})
export class RadioConfirmModalComponent implements OnInit, OnDestroy {
  public workpackage = new FormControl('', Validators.required);
  public selectedWorkPackages: WorkPackageEntity[];

  constructor(
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<RadioConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.selectedWorkPackages = data.selectedWorkPackages
    }

  ngOnInit(): void {
    this.store.pipe(select(getWorkPackageEntities)).subscribe(workpackages => {
      const currentState = workpackages.filter(workpackage => workpackage.id === currentArchitecturePackageId);
      this.selectedWorkPackages.unshift(...currentState);
    });
  }

  ngOnDestroy(): void {
    this.selectedWorkPackages.splice(0, 1);
  }

  onSave(): void {
    if (!this.workpackage.value) {
      return;
    }
    this.dialogRef.close({ workpackages: this.workpackage.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
