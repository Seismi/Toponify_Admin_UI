import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import {
  DeleteWorkpackageLink,
  LoadWorkpackageLinkDescendants,
  WorkPackageLinkActionTypes
} from '@app/workpackage/store/actions/workpackage-link.actions';

@Component({
  selector: 'smi-delete-link-modal',
  templateUrl: './delete-link-modal.component.html',
  styleUrls: ['./delete-link-modal.component.scss']
})
export class DeleteLinkModalComponent implements OnInit, OnDestroy {
  descendants: any[] = [];
  processing = false;
  error: string = null;
  workpackageId: string;
  private subscriptions: Subscription[] = [];

  payload: any = null;

  constructor(
    public dialogRef: MatDialogRef<DeleteLinkModalComponent>,
    private store: Store<NodeState>,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processing = true;
    this.payload = data.payload;
    this.workpackageId = data.workpackageId;

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendantsSuccess))
        .subscribe((action: any) => {
          this.descendants = action.payload;
          this.processing = false;
        })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageLinkActionTypes.LoadWorkpackageLinkDescendantsFailure))
        .subscribe((error: any) => {
          // FIXME: should be improved
          this.error = error.payload.join(' ');
          this.processing = false;
        })
    );

    this.subscriptions.push(
      this.actions
        .pipe(ofType(WorkPackageLinkActionTypes.DeleteWorkpackageLinkSuccess))
        .subscribe(action => this.dialogRef.close(action))
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(WorkPackageLinkActionTypes.DeleteWorkpackageLinkFailure)).subscribe((error: any) => {
        // FIXME: should be improved
        this.error = error.payload.toString();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  findWorkpackageLinkIds(link: any): { workpackageId: string; linkId: string } {
    if (!link.id) {
      throw new Error('Missing link id');
    }
    if (!this.workpackageId) {
      throw new Error('Workpackage missing');
    }
    return {
      linkId: link.id,
      workpackageId: this.workpackageId
    };
  }

  ngOnInit(): void {
    try {
      const { workpackageId, linkId } = this.findWorkpackageLinkIds(this.payload);
      this.store.dispatch(new LoadWorkpackageLinkDescendants({ workpackageId, linkId }));
    } catch (err) {
      // TODO: handle error
      console.error(err);
    }
  }

  onYes() {
    const { workpackageId, linkId } = this.findWorkpackageLinkIds(this.payload);
    this.store.dispatch(new DeleteWorkpackageLink({ workpackageId, linkId }));
  }

  onNo(): void {
    this.dialogRef.close({});
  }
}
