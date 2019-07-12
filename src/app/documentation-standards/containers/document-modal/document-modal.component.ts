import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { DocumentStandardsService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards.service';
import { DocumentStandardsValidatorService } from '@app/documentation-standards/components/documentation-standards-detail/services/document-standards-validator.service';

@Component({
  selector: 'smi-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.scss'],
  providers: [DocumentStandardsService, DocumentStandardsValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})

export class DocumentModalComponent implements OnInit {

  documentStandard: DocumentStandard;
  modalMode = true;
  isEditable = true;
  isDisabled = false;

  constructor(
    private documentStandardsService: DocumentStandardsService,
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.documentStandard = data.documentStandard;
    }

  ngOnInit() { }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  onSubmit(data: any) {
    if (!this.documentStandardsService.isValid) {
      return;
    }
    this.dialogRef.close({ documentStandard: this.documentStandardsForm.value });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}