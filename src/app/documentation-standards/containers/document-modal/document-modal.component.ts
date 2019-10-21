import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';
import { NodeDetail } from '@app/nodes/store/models/node.model';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

@Component({
  selector: 'smi-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService]
})

export class DocumentModalComponent implements OnInit {

  documentStandard: DocumentStandard;
  customProperties: NodeDetail;
  modalMode = true;
  isEditable = true;
  isDisabled = false;
  public isEditMode: boolean;
  public mode: string;
  public name: string;

  constructor(
    private documentStandardsService: DocumentStandardsService,
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.documentStandard = data.documentStandard;
      this.customProperties = data.customProperties;
      this.name = data.name;
      this.mode = data.mode;
      (this.mode === 'edit')
        ? this.isEditMode = true
        : this.isEditMode = false;
    }

  ngOnInit() {
    if(this.isEditMode) {
      this.documentStandardsService.documentStandardsForm.patchValue({
        ...this.customProperties.customPropertyValues[0]
      });
    }
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  onSubmit(data: any) {
    if (!this.documentStandardsService.isValid) {
      return;
    }
    this.dialogRef.close({ 
      customProperties: this.documentStandardsForm.value, 
      mode: this.mode, documentStandard: 
      this.documentStandardsForm.value 
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}