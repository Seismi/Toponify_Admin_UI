import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

  types = ['Boolean', 'Text', 'Hyperlink', 'Number', 'Date'];

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