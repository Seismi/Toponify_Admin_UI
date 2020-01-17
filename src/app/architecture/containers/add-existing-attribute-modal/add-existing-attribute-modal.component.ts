import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { State as AttributeState } from '@app/attributes/store/reducers/attributes.reducer';
import { LoadAttributes } from '@app/attributes/store/actions/attributes.actions';
import { getAttributeEntities } from '@app/attributes/store/selectors/attributes.selector';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'smi-add-existing-attribute-modal',
  templateUrl: './add-existing-attribute-modal.component.html',
  styleUrls: ['./add-existing-attribute-modal.component.scss']
})
export class AddExistingAttributeModalComponent implements OnInit {
  public attributes$: Observable<AttributeEntity[]>
  public attribute: AttributeEntity;

  constructor(
    private store: Store<AttributeState>,
    public dialogRef: MatDialogRef<AddExistingAttributeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttributeEntity) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadAttributes({}));
    this.attributes$ = this.store.pipe(select(getAttributeEntities));
  }

  onSubmit(): void {
    this.dialogRef.close({ attribute: this.attribute });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAttributeSelect(attribute: AttributeEntity): void {
    this.attribute = attribute;
  }
}