import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { DeleteNode, LoadNodeDescendants, VersionNodeActionTypes } from '@app/nodes/store/actions/node.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State as NodeState } from '../../../nodes/store/reducers/node.reducer';
import { NodeType } from '@app/nodes/services/node.service';

@Component({
  selector: 'smi-delete-node-modal',
  templateUrl: './delete-node-modal.component.html',
  styleUrls: ['./delete-node-modal.component.scss']
})
export class DeleteNodeModalComponent implements OnInit, OnDestroy {
  node: any = null;
  processing = false;
  error: string = null;
  payload: {nodeId: string, nodeType: NodeType} = null;

  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<DeleteNodeModalComponent>,
    private store: Store<NodeState>,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processing = true;
    this.payload = data.payload;

    /*this.subscriptions.push(this.actions.pipe(ofType(VersionNodeActionTypes.LoadNodeDescendantsSuccess))
      .subscribe((action: any) => {
        this.node = action.payload;
        this.processing = false;
      }));*/

    /*this.subscriptions.push(this.actions.pipe(ofType(VersionNodeActionTypes.LoadNodeDescendantsFailure))
      .subscribe((error: any) => {
        // FIXME: should be improved
        this.error = error.payload.join(' ');
        this.processing = false;
      }));*/

    /*this.subscriptions.push(this.actions.pipe(ofType(VersionNodeActionTypes.DeleteNodeSuccess))
      .subscribe(action => this.dialogRef.close(action)));*/

    /*this.subscriptions.push(this.actions.pipe(ofType(VersionNodeActionTypes.DeleteNodeFailure))
      .subscribe((error: any) => {
        // FIXME: should be improved
        this.error = error.payload.toString();
      }));*/
  }

  getLinkName(link: any) {
    return link.name ? link.name : link.id;
  }

  getNodeName(node: any) {
    return node.object && node.object.name ? node.object.name : '<No title>';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    // this.store.dispatch(new LoadNodeDescendants(this.payload));
  }

  onYes() {
    // this.store.dispatch(new DeleteNode(this.payload));
  }

  onNo(): void {
    this.dialogRef.close({ });
  }
}