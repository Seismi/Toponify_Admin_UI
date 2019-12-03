import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})
export class DocumentModalComponent implements OnInit {
  documentStandard: DocumentStandard;
  customProperties: CustomPropertyValuesEntity;
  modalMode = true;
  isEditable = true;
  isDisabled = false;
  public isEditMode: boolean;
  public mode: string;
  public name: string;
  private reg;
  dateType = false;
  booleanType = false;
  propertyType: string;

  constructor(
    private documentStandardsService: DocumentStandardsService,
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.documentStandard = data.documentStandard;
    this.customProperties = data.customProperties;
    this.name = data.name;
    this.mode = data.mode;
    this.mode === 'edit' ? (this.isEditMode = true) : (this.isEditMode = false);
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.documentStandardsService.documentStandardsForm = this.fb.group({
        value: [
          null,
          Validators.pattern(
            this.documentStandardsService.getPropertyValueValidator(this.customProperties.type, this.reg)
          )
        ]
      });

      this.propertyType = this.customProperties.type;

      this.customProperties.type === 'Date' ? (this.dateType = true) : (this.dateType = false);
      this.customProperties.type === 'Boolean' ? (this.booleanType = true) : (this.booleanType = false);

      this.documentStandardsService.documentStandardsForm.patchValue({
        ...this.customProperties
      });
    }
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  onSubmit() {
    if (!this.documentStandardsService.isValid) {
      return;
    }
    this.dialogRef.close({
      customProperties: this.documentStandardsForm.value,
      documentStandard: this.documentStandardsForm.value,
      mode: this.mode
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
