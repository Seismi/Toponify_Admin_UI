import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { FindPotentialWorkpackageNodes } from '@app/workpackage/store/actions/workpackage-node.actions';
import { FormControl } from '@angular/forms';
import { WorkPackageNodeFindPotential } from '@app/workpackage/store/models/workpackage.models';
import { getPotentialWorkPackageNodes } from '@app/architecture/store/selectors/workpackage.selector';

@Component({
  selector: 'smi-descendants-modal',
  templateUrl: './descendants-modal.component.html',
  styleUrls: ['./descendants-modal.component.scss']
})
export class DescendantsModalComponent implements OnInit {
  public descendants$: Observable<DescendantsEntity[]>;
  public displayedColumns: string[] = ['name'];
  public selectedDescendants: DescendantsEntity[] = [];
  public workpackageId: string;
  public nodeId: string;
  public childrenOf: WorkPackageNodeFindPotential;
  public components = new FormControl();

  constructor(
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<DescendantsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.workpackageId = data.workpackageId;
    this.nodeId = data.nodeId;
    this.childrenOf = data.childrenOf;
  }

  ngOnInit() {
    this.store.dispatch(
      new FindPotentialWorkpackageNodes({
        workPackageId: this.workpackageId,
        nodeId: this.nodeId,
        data: this.childrenOf
      })
    );
    this.descendants$ = this.store.pipe(select(getPotentialWorkPackageNodes));
  }

  onSubmit(): void {
    this.dialogRef.close({ descendant: this.selectedDescendants });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSelect($event: MatSelectChange, children: DescendantsEntity): void {
    if ($event.source.selected) {
      this.selectedDescendants.push(children);
    }
    if (!$event.source.selected) {
      const index = this.selectedDescendants.indexOf(children);
      if (index > -1) {
        this.selectedDescendants.splice(index, 1);
      }
    }
  }
}
