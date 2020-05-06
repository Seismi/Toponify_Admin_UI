import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable, combineLatest } from 'rxjs';
import { State as WorkPackageState } from '@app/workpackage/store/reducers/workpackage.reducer';
import { Store, select } from '@ngrx/store';
import { getNodeScopes } from '@app/architecture/store/selectors/workpackage.selector';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';
import { getScopeEntities } from '@app/scope/store/selectors/scope.selector';
import { map } from 'rxjs/operators';
import { ScopeEntity } from '@app/scope/store/models/scope.model';

const everything: Readonly<string> = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'smi-add-scope-modal',
  templateUrl: './add-scope-modal.component.html',
  styleUrls: ['./add-scope-modal.component.scss']
})
export class NodeScopeModalComponent implements OnInit {
  public scopes$: Observable<ScopeEntity[]>;
  public nodeId: string;
  public scope: string;

  constructor(
    private store: Store<WorkPackageState>,
    public dialogRef: MatDialogRef<NodeScopeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nodeId = data.nodeId;
  }

  ngOnInit(): void {
    this.scopes$ = combineLatest(
      this.store.pipe(select(getNodeScopes)),
      this.store.pipe(select(getScopeEntities))
    ).pipe(
      map(([nodeScopes, scopeEntities]) => {
        return scopeEntities.filter(scope => scope.id !== everything && !nodeScopes.some(nscope => scope.id === nscope.id));
      })
    );
  }

  onSubmit(): void {
    this.dialogRef.close({ scope: this.scope });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(scope: WorkPackageNodeScopes): void {
    this.scope = scope.id;
  }
}
