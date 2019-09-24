import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import {
  DeleteWorkpackageNode,
  LoadWorkPackageNodeDescendants,
  WorkPackageNodeActionTypes
} from '@app/workpackage/store/actions/workpackage-node.actions';

@Component({
  selector: 'smi-delete-node-modal',
  templateUrl: './delete-node-modal.component.html',
  styleUrls: ['./delete-node-modal.component.scss']
})
export class DeleteNodeModalComponent implements OnInit, OnDestroy {
  descendants: any[] = [];
  processing = false;
  error: string = null;
  payload: any = null;

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteNodeModalComponent>,
    private store: Store<NodeState>,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processing = true;
    this.payload = data.payload;

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsSuccess))
        .subscribe((action: any) => {
          this.descendants = action.payload;
          this.processing = false;
        })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageNodeActionTypes.LoadWorkPackageNodeDescendantsFailure))
        .subscribe((error: any) => {
          // FIXME: should be improved
          this.error = error.payload.join(' ');
          this.processing = false;
        })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageNodeActionTypes.DeleteWorkpackageNodeSuccess))
        .subscribe(action => this.dialogRef.close(action))
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(WorkPackageNodeActionTypes.DeleteWorkpackageNodeFailure)).subscribe((error: any) => {
        // FIXME: should be improved
        this.error = error.payload.toString();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  findWorkpackageNodeIds(node: any): { workpackageId: string; nodeId: string } {
    if (!node.id) {
      throw new Error('Missing node id');
    }
    if (!node.impactedByWorkPackages || node.impactedByWorkPackages.length < 1) {
      throw new Error('Workpackage missing');
    }
    return {
      nodeId: node.id,
      workpackageId: node.impactedByWorkPackages[0].id
    };
  }

  ngOnInit(): void {
    try {
      const { workpackageId, nodeId } = this.findWorkpackageNodeIds(this.payload);
      this.store.dispatch(new LoadWorkPackageNodeDescendants({ workpackageId, nodeId }));
    } catch (err) {
      // TODO: handle error
      console.error(err);
    }
  }

  onYes() {
    const { workpackageId, nodeId } = this.findWorkpackageNodeIds(this.payload);
    this.store.dispatch(new DeleteWorkpackageNode({ workpackageId, nodeId }));
  }

  onNo(): void {
    this.dialogRef.close({});
  }
}
