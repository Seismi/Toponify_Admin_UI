import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { LoadWorkPackagesActive } from '@app/workpackage/store/actions/workpackage.actions';
import { getWorkPackagesActive } from '@app/workpackage/store/selectors/workpackage.selector';
import { map } from 'rxjs/operators';
import { WorkPackagesActive } from '@app/workpackage/store/models/workpackage.models';
import { Observable } from 'rxjs';

 @Component({
  selector: 'smi-add-objective-modal',
  templateUrl: './move-objective-modal.component.html',
  styleUrls: ['./move-objective-modal.component.scss']
})
export class MoveObjectiveModalComponent implements OnInit {
  public control = new FormControl();
  public workPackages$: Observable<WorkPackagesActive[]>;

  constructor(
    private store: Store<WorkPackageState>,
    private dialogRef: MatDialogRef<MoveObjectiveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadWorkPackagesActive());
    this.workPackages$ = this.store.pipe(
      select(getWorkPackagesActive),
      map(workpackages => workpackages.filter(wp => wp.status === 'draft'))
    );
  }

  onConfirm(): void {
    if (this.control.valid) {
      this.dialogRef.close(this.control.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
