import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { FormGroup, Validators } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { EditDocumentationStandardsFormService } from './form/services/form.service';
import { EditDocumentationStandardsFormValidatorService } from './form/services/form-validator.service';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-edit-documentation-standards-table',
  templateUrl: './edit-documentation-standards.component.html',
  styleUrls: ['./edit-documentation-standards.component.scss'],
  providers: [EditDocumentationStandardsFormService, EditDocumentationStandardsFormValidatorService]
})
export class EditDocumentationStandardsTableComponent {
  @Input() group: FormGroup;
  @Input() isEditable = true;
  @Input() nodeCategory: string;
  @Input() canEdit = true;
  @Input() data: NodeDetail[];

  public index: number;

  constructor(private editDocumentationStandardsFormService: EditDocumentationStandardsFormService) {}

  @Output() saveProperty = new EventEmitter<{ propertyId: string; value: string }>();
  @Output() deleteProperty = new EventEmitter<CustomPropertiesEntity>();

  get editDocumentationStandardsForm(): FormGroup {
    return this.editDocumentationStandardsFormService.editDocumentationStandardsForm;
  }

  onEdit(documentStandard: DocumentStandard, index: number): void {
    this.index = index;
    const reg = this.editDocumentationStandardsFormService.getValueValidation(documentStandard.type);
    this.editDocumentationStandardsForm.get('value').setValidators([Validators.pattern(reg)]);
    this.editDocumentationStandardsFormService.editDocumentationStandardsForm.patchValue({
      value: documentStandard.value
    });
  }

  onSave(propertyId: string): void {
    if (!this.editDocumentationStandardsFormService.isValid) {
      return;
    }
    this.index = -1;
    this.saveProperty.emit({ propertyId: propertyId, value: this.editDocumentationStandardsForm.value });
  }

  onCancel(): void {
    this.index = -1;
  }

  onDelete(property: CustomPropertiesEntity): void {
    this.index = -1;
    this.deleteProperty.emit(property);
  }

  nodeIsEditable(): boolean {
    return (!this.isEditable || this.nodeCategory === 'copy');
  }

}
