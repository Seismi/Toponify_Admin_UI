import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants';

@Component({
  selector: 'smi-documentation-standards-detail',
  templateUrl: 'documentation-standards-detail.component.html',
  styleUrls: ['documentation-standards-detail.component.scss']
})
export class DocumentationStandardsDetailComponent {

  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() isDisabled = true;
  @Input() modalMode = false;
  @Input() isEditMode: boolean;
  @Input() dateType: boolean;
  @Input() propertyType: string;
  @Input() booleanType: boolean;

  types = Constants.PROPERTY_TYPES;
  booleanTypes = Constants.BOOLEAN_TYPES;

  @Output()
  saveDocument = new EventEmitter();

  @Output()
  deleteDocument = new EventEmitter();

  onEdit() {
    this.isEditable = true;
    this.isDisabled = false;
  }

  onSave() {
    this.isEditable = false;
    this.isDisabled = true;
    this.saveDocument.emit();
  }

  onCancel() {
    this.isDisabled = true;
    this.isEditable = false;
  }

  onDelete() {
    this.deleteDocument.emit();
  }
}