import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State as LayoutState } from '@app/layout/store/reducers/layout.reducer';
import { Store } from '@ngrx/store';
import { AddLayout, LayoutActionTypes } from '@app/layout/store/actions/layout.actions';
import { Subscription } from 'rxjs';
import { ofType, Actions } from '@ngrx/effects';

@Component({
  selector: 'smi-save-layout-modal',
  templateUrl: './save-layout-modal.component.html',
  styleUrls: ['./save-layout-modal.component.scss']
})
export class SaveLayoutModalComponent implements OnDestroy {
  public nameForm: FormGroup;
  subscriptions: Subscription[] = [];
  processing = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SaveLayoutModalComponent>,
    private store: Store<LayoutState>,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; draft: any; scope: any; layout: any }
  ) {
    this.nameForm = this.fb.group({
      name: [data.name, Validators.required]
    });

    this.subscriptions.push(
      this.actions.pipe(ofType(LayoutActionTypes.AddLayoutSuccess)).subscribe((_action: any) => {
        this.processing = false;
        this.dialogRef.close(this.nameForm.value);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(LayoutActionTypes.AddLayoutFailure)).subscribe((_error: any) => {
        this.processing = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.nameForm.valid) {
      this.processing = true;
      this.store.dispatch(
        new AddLayout({
          copyFromLayoutId: this.data.draft ? this.data.draft.layoutId : this.data.layout.id,
          layoutDetails: {
            name: this.nameForm.value.name,
            scope: this.data.scope
          },
          positionDetails: this.data.draft
            ? this.data.draft.data.positionDetails
            : {
                workPackages: [],
                positions: {
                  nodes: [],
                  nodeLinks: []
                }
              }
        })
      );
    }
  }
}
