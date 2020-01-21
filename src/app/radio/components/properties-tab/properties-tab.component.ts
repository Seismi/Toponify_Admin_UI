import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';
import { FormGroup } from '@angular/forms';
import { DocumentStandard } from '@app/documentation-standards/store/models/documentation-standards.model';

const columns: string[] = ['name', 'value', 'edit', 'delete'];

@Component({
  selector: 'smi-radio-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class RadioPropertiesTabComponent {
  @Input() group: FormGroup;
  @Input() index: number;

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

  @Output() editProperty = new EventEmitter<{documentStandard: DocumentStandard, index: number}>();
  @Output() saveProperty = new EventEmitter<string>();
  @Output() cancelPropertyEdit = new EventEmitter<void>();
  @Output() deleteProperty = new EventEmitter<CustomPropertiesEntity>();

  onEdit(documentStandard: DocumentStandard, index: number): void {
    this.editProperty.emit({documentStandard, index});
  }

  onSave(propertyId: string): void {
    this.saveProperty.emit(propertyId);
  }

  onCancel(): void {
    this.cancelPropertyEdit.emit();
  }

  onDelete(property: CustomPropertiesEntity): void {
    this.deleteProperty.emit(property);
  }

}
