import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as RadioState } from '@app/radio/store/reducers/radio.reducer';
import { LoadRadios } from '@app/radio/store/actions/radio.actions';
import { RadioEntity } from '@app/radio/store/models/radio.model';
import { getRadioEntities } from '@app/radio/store/selectors/radio.selector';

@Component({
  selector: 'smi-radio-list-modal',
  templateUrl: './radio-list-modal.component.html',
  styleUrls: ['./radio-list-modal.component.scss'],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class RadioListModalComponent implements OnInit {

  radio$: Observable<RadioEntity[]>;
  radio: RadioEntity;

  constructor(
    private store: Store<RadioState>,
    public dialogRef: MatDialogRef<RadioListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.radio = data.radio;
    }

  ngOnInit() {
    this.store.dispatch(new LoadRadios({}));
    this.radio$ = this.store.pipe(select(getRadioEntities));
  }

  onSelectRadio(row: RadioEntity) {
    this.radio = row;
  }

  onSubmit() {
    this.dialogRef.close({ radio: this.radio });
  }

  onCancel() {
    this.dialogRef.close();
  }

  @Output()
  addNewRadio = new EventEmitter();

  onAddNew() {
    this.dialogRef.close();
    this.addNewRadio.emit();
  }

}