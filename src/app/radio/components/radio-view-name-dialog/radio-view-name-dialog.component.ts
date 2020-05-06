import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { getRadioFilter } from '@app/radio/store/selectors/radio.selector';
import { take } from 'rxjs/operators';
import { CreateRadioView, RadioActionTypes } from '@app/radio/store/actions/radio.actions';
import { Subscription } from 'rxjs';
import { ofType, Actions } from '@ngrx/effects';

@Component({
  selector: 'app-radio-view-name-dialog',
  templateUrl: './radio-view-name-dialog.component.html',
  styleUrls: ['./radio-view-name-dialog.component.css']
})
export class RadioViewNameDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public nameForm: FormGroup;
  public processing = false;
  constructor(
    private actions: Actions,
    public dialogRef: MatDialogRef<RadioViewNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private fb: FormBuilder,
    private store: Store<RadioState>
  ) {
    this.nameForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.subscriptions.push(
      this.actions.pipe(ofType(RadioActionTypes.CreateRadioViewSuccess)).subscribe((action: any) => {
        this.processing = false;
        this.dialogRef.close(action);
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(RadioActionTypes.CreateRadioViewFail)).subscribe((_error: any) => {
        this.processing = false;
      })
    );
  }

  get isValid(): boolean {
    return this.nameForm.valid;
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSubmit() {
    if (this.isValid) {
      const radioViewName = this.nameForm.controls.name.value;
      this.store
        .pipe(
          select(getRadioFilter),
          take(1)
        )
        .subscribe(filters => {
          this.store.dispatch(
            new CreateRadioView({
              // id: 'string',
              name: radioViewName,
              favourite: false,
              type: 'Simple Table',
              filterSet: filters
            })
          );
        });
    }
  }
}
