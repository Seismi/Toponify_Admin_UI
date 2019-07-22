import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { AttributeDetailService } from '@app/attributes/components/attribute-detail/services/attribute-detail.service';
import { AttributeValidatorService } from '@app/attributes/components/attribute-detail/services/attribute-detail-validator.service';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-attribute-modal',
  templateUrl: './attribute-modal.component.html',
  styleUrls: ['./attribute-modal.component.scss'],
  providers: [AttributeDetailService, AttributeValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class AttributeModalComponent {

  attribute: AttributeEntity;

  constructor(
    private attributeDetailService: AttributeDetailService,
    public dialogRef: MatDialogRef<AttributeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.attribute = data.attribute;
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