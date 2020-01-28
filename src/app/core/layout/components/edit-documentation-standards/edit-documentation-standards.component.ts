import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { FormGroup, Validators } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';
import { EditDocumentationStandardsFormService } from './form/services/form.service';
import { EditDocumentationStandardsFormValidatorService } from './form/services/form-validator.service';

const columns: string[] = ['name', 'value', 'edit', 'delete'];

@Component({
  selector: 'smi-edit-documentation-standards-table',
  templateUrl: './edit-documentation-standards.component.html',
  styleUrls: ['./edit-documentation-standards.component.scss'],
  providers: [EditDocumentationStandardsFormService, EditDocumentationStandardsFormValidatorService]
})
export class EditDocumentationStandardsTableComponent {
  @Input() group: FormGroup;
  @Input() isEditable: boolean = true;
  @Input() nodeCategory: string;
  public index: number;

  @Input()
  set data(data: NodeDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<NodeDetail>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = columns;

  constructor(private editDocumentationStandardsFormService: EditDocumentationStandardsFormService) { }

  @Output() saveProperty = new EventEmitter<{propertyId: string, value: string}>();
  @Output() deleteProperty = new EventEmitter<CustomPropertiesEntity>();

  get editDocumentationStandardsForm(): FormGroup {
    return this.editDocumentationStandardsFormService.editDocumentationStandardsForm;
  }

  onEdit(documentStandard: DocumentStandard, index: number): void {
    this.index = index;
    const reg = this.editDocumentationStandardsFormService.getValueValidation(documentStandard.type);
    this.editDocumentationStandardsForm.get('value').setValidators([Validators.pattern(reg)]);
    this.editDocumentationStandardsFormService.editDocumentationStandardsForm.patchValue({value: documentStandard.value});
  }

  onSave(propertyId: string): void {
    if (!this.editDocumentationStandardsFormService.isValid) {
      return;
    }
    this.index = -1;
    this.saveProperty.emit({propertyId: propertyId, value: this.editDocumentationStandardsForm.value});
  }

  onCancel(): void {
    this.index = -1;
  }

  onDelete(property: CustomPropertiesEntity): void {
    this.index = -1;
    this.deleteProperty.emit(property);
  }

  nodeIsEditable(): boolean {
    if (!this.isEditable || this.nodeCategory === 'copy') {
      return true;
    }
    return false;
  }

}
