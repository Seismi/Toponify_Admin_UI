import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { AttributeDetailService } from '@app/attributes/components/attribute-detail/services/attribute-detail.service';
import { AttributeValidatorService } from '@app/attributes/components/attribute-detail/services/attribute-detail-validator.service';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { Store, select } from '@ngrx/store';
import { State as NodeState } from '@app/architecture/store/reducers/architecture.reducer';
import { getSelectedNode } from '@app/architecture/store/selectors/node.selector';

@Component({
  selector: 'smi-attribute-modal',
  templateUrl: './attribute-modal.component.html',
  styleUrls: ['./attribute-modal.component.scss'],
  providers: [AttributeDetailService, AttributeValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class AttributeModalComponent implements OnInit {

  attribute: AttributeEntity;
  node: NodeDetail;

  constructor(
    private store: Store<NodeState>,
    private attributeDetailService: AttributeDetailService,
    public dialogRef: MatDialogRef<AttributeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.attribute = data.attribute;
    }

  ngOnInit() {
    this.store.pipe(select(getSelectedNode)).subscribe(node => {
      this.node = node;
    });
  }
    
  get attributeDetailForm(): FormGroup {
    return this.attributeDetailService.attributeDetailForm;
  }

  onSave() {
    if (!this.attributeDetailService.isValid) {
      return;
    }
    this.dialogRef.close({ attribute: this.attributeDetailForm.value });
  }

  onCancel() {
    this.dialogRef.close();
  }

}