import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Observable } from 'rxjs';
import { Node } from '@app/architecture/store/models/node.model';
import { select, Store } from '@ngrx/store';
import { getNodeEntities } from '@app/architecture/store/selectors/node.selector';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { LoadNodes } from '@app/architecture/store/actions/node.actions';

@Component({
  selector: 'smi-delete-property-modal',
  templateUrl: './associate-modal.component.html',
  styleUrls: ['./associate-modal.component.scss']
})
export class AssociateModalComponent implements OnInit {
  public title: string;
  public workpackages$: Observable<WorkPackageEntity[]>;
  public nodes$: Observable<Node[]>;
  public selectedWorkpackageId = '00000000-0000-0000-0000-000000000000';
  public selectedNodeId: string;

  constructor(
    private store: Store<NodeState>,
    public dialogRef: MatDialogRef<AssociateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; workpackages$: Observable<WorkPackageEntity[]> }
  ) {
    this.title = data.title;
    this.workpackages$ = data.workpackages$;
  }

  ngOnInit(): void {
    this.nodes$ = this.store.pipe(select(getNodeEntities));
  }

  onSelectWorkPackage($event: MatSelectChange): void {
    this.selectedWorkpackageId = $event.value;
    this.getNodesWithWorkPackageQuery($event.value);
  }

  getNodesWithWorkPackageQuery(workPackageId: string): void {
    const queryParams = {
      workPackageQuery: [workPackageId]
    };
    this.store.dispatch(new LoadNodes(queryParams));
  }

  onConfirm() {
    this.dialogRef.close({
      nodeId: this.selectedNodeId,
      workpackageId: this.selectedWorkpackageId
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
