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
  @Input() isEditable: boolean = false;
  @Input() isDisabled: boolean = true;
  @Input() modalMode: boolean = false;

  public types = Constants.PROPERTY_TYPES;

  @Output() saveDocument = new EventEmitter<void>();
  @Output() deleteDocument = new EventEmitter<void>();

  onEdit(): void {
    this.isEditable = true;
    this.isDisabled = false;
  }

  onSave(): void {
    this.isEditable = false;
    this.isDisabled = true;
    this.saveDocument.emit();
  }

  onCancel(): void {
    this.isDisabled = true;
    this.isEditable = false;
  }

  onDelete(): void {
    this.deleteDocument.emit();
  }
}
