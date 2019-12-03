import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State as AttributesState } from '@app/attributes/store/reducers/attributes.reducer';
import { LoadAttributes } from '@app/attributes/store/actions/attributes.actions';
import { getAttributeEntities } from '@app/attributes/store/selectors/attributes.selector';

@Component({
  selector: 'smi-related-attributes-modal',
  templateUrl: './related-attributes-modal.component.html',
  styleUrls: ['./related-attributes-modal.component.scss'],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class RelatedAttributesModalComponent implements OnInit {
  public attributes$: Observable<AttributeEntity[]>;
  public attribute: AttributeEntity;

  constructor(
    private store: Store<AttributesState>,
    public dialogRef: MatDialogRef<RelatedAttributesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.attribute = data.attribute;
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadAttributes());
    this.attributes$ = this.store.pipe(select(getAttributeEntities));
  }

  onSubmit(): void {
    this.dialogRef.close({ attribute: this.attribute });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelectAttribute(attribute: AttributeEntity): void {
    this.attribute = attribute;
  }
}
