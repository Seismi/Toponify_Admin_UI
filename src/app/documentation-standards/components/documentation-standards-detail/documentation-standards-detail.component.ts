import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from '@app/core/constants';
import { Roles } from '@app/core/directives/by-role.directive';
import { DocumentStandardsService } from './services/document-standards.service';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

@Component({
  selector: 'smi-documentation-standards-detail',
  templateUrl: 'documentation-standards-detail.component.html',
  styleUrls: ['documentation-standards-detail.component.scss']
})
export class DocumentationStandardsDetailComponent {
  private values: DocumentStandard;
  @Input() group: FormGroup;
  @Input() isEditable = false;
  @Input() isDisabled = true;
  @Input() modalMode = false;

  @Input('group') set setGroup(group) {
    this.group = group;
    this.values = group.value;
  }

  public types = Constants.PROPERTY_TYPES;
  public Roles = Roles;

  @Output() saveDocument = new EventEmitter<void>();
  @Output() deleteDocument = new EventEmitter<void>();

  constructor(private documentStandardsService: DocumentStandardsService) { }

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
    this.documentStandardsService.updateForm(this.values);
    this.isDisabled = true;
    this.isEditable = false;
  }

  onDelete(): void {
    this.deleteDocument.emit();
  }
}
