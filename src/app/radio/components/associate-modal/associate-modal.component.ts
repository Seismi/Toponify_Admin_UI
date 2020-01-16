import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';
import { Observable } from 'rxjs';
import { Node } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-delete-property-modal',
  templateUrl: './associate-modal.component.html',
  styleUrls: ['./associate-modal.component.scss']
})
export class AssociateModalComponent {
  public title: string;
  public workpackages$: Observable<WorkPackageEntity[]>;
  public nodes$: Observable<Node[]>;
  public selectedWorkpackageId = '00000000-0000-0000-0000-000000000000';
  public selectedNodeId: string;

  constructor(
    public dialogRef: MatDialogRef<AssociateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; workpackages$: Observable<WorkPackageEntity[]>; nodes$: Observable<Node[]> }
  ) {
    this.title = data.title;
    this.workpackages$ = data.workpackages$;
    this.nodes$ = data.nodes$;
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
