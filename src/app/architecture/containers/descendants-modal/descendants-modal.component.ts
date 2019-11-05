import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { DescendantsEntity } from '@app/architecture/store/models/node.model';
import { Observable } from 'rxjs';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { FindPotentialWorkpackageNodes } from '@app/workpackage/store/actions/workpackage-node.actions';
import { State as ArchitectureState } from '@app/architecture/store/reducers/architecture.reducer';
import { getPotentialWorkPackageNodes } from '@app/architecture/store/selectors/workpackage.selector';
import { FormControl } from '@angular/forms';
import { WorkPackageNodeFindPotential } from '@app/workpackage/store/models/workpackage.models';

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
    private architectureStore: Store<ArchitectureState>,
    public dialogRef: MatDialogRef<DescendantsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.workpackageId = data.workpackageId;
      this.nodeId = data.nodeId;
      this.childrenOf = data.childrenOf;
    }

  ngOnInit() {
    this.store.dispatch(new FindPotentialWorkpackageNodes({workPackageId: this.workpackageId, nodeId: this.nodeId, data: this.childrenOf}));
    this.descendants$ = this.architectureStore.pipe(select(getPotentialWorkPackageNodes));
  }

  onSubmit() {
    this.dialogRef.close({descendant: this.selectedDescendants});
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSelect($event, children: DescendantsEntity) {
    if($event.source.selected) {
      this.selectedDescendants.push(children)
    }
    if(!$event.source.selected) {
      let index = this.selectedDescendants.indexOf(children);
      if(index > -1) {
        this.selectedDescendants.splice(index, 1);
      }
    }
  }

}