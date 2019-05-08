import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LinkType } from '@app/nodes/services/node.service';
// import { DeleteLink, LoadLinkDescendants, LinkActionTypes } from '@app/nodes/store/actions/node.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {NodesState} from '@app/nodes/store/reducers';

@Component({
  selector: 'smi-delete-link-modal',
  templateUrl: './delete-link-modal.component.html',
  styleUrls: ['./delete-link-modal.component.scss']
})
export class DeleteLinkModalComponent implements OnInit, OnDestroy {
  link: any = null;
  processing = false;
  error: string = null;
  subscriptions: Subscription[] = [];

  payload: {linkId: string, linkType: LinkType} = null;

  constructor(
    public dialogRef: MatDialogRef<DeleteLinkModalComponent>,
    private store: Store<NodesState>,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processing = true;
    this.payload = data.payload;

    /*this.subscriptions.push(this.actions.pipe(ofType(LinkActionTypes.LoadLinkDescendantsSuccess)).subscribe((action: any) => {
      this.link = action.payload;
      this.processing = false;
    }));*/

    /*this.subscriptions.push(this.actions.pipe(ofType(LinkActionTypes.LoadLinkDescendantsFailure)).subscribe((error: any) => {
        // FIXME: should be improved
        this.error = error.payload.join(' ');
        this.processing = false;
    }));*/

    /*this.subscriptions.push(this.actions.pipe(ofType(LinkActionTypes.DeleteLinkSuccess))
      .subscribe(action => this.dialogRef.close(action)));

    this.subscriptions.push(this.actions.pipe(ofType(LinkActionTypes.DeleteLinkFailure))
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
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    // Lets load node descendants
    /*this.store.dispatch(
      new LoadLinkDescendants(this.payload)
    );*/
  }

  onYes() {
    /*this.store.dispatch(
      new DeleteLink(this.payload)
    );*/
  }

  onNo(): void {
    this.dialogRef.close({});
  }
}
