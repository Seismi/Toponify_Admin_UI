import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import {currentArchitecturePackageId, WorkPackageEntity} from '@app/workpackage/store/models/workpackage.models';
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
  public selectedWorkpackageId = currentArchitecturePackageId;
  public selectedNodeId: string;

  @ViewChild('searchInput') searchInput: ElementRef;

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

  filter(node: Node): boolean {
    const searchValue = this.searchInput.nativeElement.value;
    return searchValue !== '' && node.name.toLowerCase().indexOf(searchValue.toLowerCase()) === -1;
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
