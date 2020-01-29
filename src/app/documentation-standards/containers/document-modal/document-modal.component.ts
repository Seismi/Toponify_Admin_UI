import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
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
  public documentStandard: DocumentStandard;
  public customProperties: CustomPropertyValuesEntity;
  public modalMode: boolean = true;
  public isEditable: boolean = true;
  public isDisabled: boolean = false;

  constructor(
    private documentStandardsService: DocumentStandardsService,
    public dialogRef: MatDialogRef<DocumentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.documentStandardsService.documentStandardsForm.patchValue({ ...this.customProperties });
  }

  get documentStandardsForm(): FormGroup {
    return this.documentStandardsService.documentStandardsForm;
  }

  onSubmit(): void {
    if (!this.documentStandardsService.isValid) {
      return;
    }
    this.dialogRef.close({ documentStandard: this.documentStandardsForm.value });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
