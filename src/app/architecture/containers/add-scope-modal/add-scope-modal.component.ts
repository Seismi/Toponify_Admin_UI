import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { Store, select } from '@ngrx/store';
import { LoadWorkPackageNodeScopesAvailability } from '@app/workpackage/store/actions/workpackage-node.actions';
import { getNodeScopesAvailability } from '@app/architecture/store/selectors/workpackage.selector';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-add-scope-modal',
  templateUrl: './add-scope-modal.component.html',
  styleUrls: ['./add-scope-modal.component.scss']
})

export class NodeScopeModalComponent implements OnInit {

  public scopes$: Observable<WorkPackageNodeScopes[]>;
  public nodeId: string;
  public scope: string;

  constructor(
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<NodeScopeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.nodeId = data.nodeId;
    }

  ngOnInit(): void { 
    this.setScopeQueryParams();
    this.scopes$ = this.store.pipe(select(getNodeScopesAvailability));
  }

  setScopeQueryParams(): void {
    const queryParams = { availableForAddition: true };
    this.store.dispatch(new LoadWorkPackageNodeScopesAvailability({nodeId: this.nodeId, queryParams: queryParams}));
  }

  onSubmit(): void {
    this.dialogRef.close({scope: this.scope});
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(scope: WorkPackageNodeScopes): void {
    this.scope = scope.id;
  }

}