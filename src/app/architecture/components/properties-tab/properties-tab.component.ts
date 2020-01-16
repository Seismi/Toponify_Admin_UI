import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NodeDetail, CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class PropertiesTabComponent {
  @Input() workPackageIsEditable: boolean;
  @Input() nodeCategory: string;

  @Input()
  set data(data: NodeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = ['name', 'value', 'edit', 'delete'];

  @Output()
  editProperties = new EventEmitter<CustomPropertyValuesEntity>();

  @Output()
  deleteProperties = new EventEmitter<CustomPropertyValuesEntity>();

  onEdit(customProperty: CustomPropertyValuesEntity) {
    this.editProperties.emit(customProperty);
  }

  onDelete(customProperty: CustomPropertiesEntity) {
    this.deleteProperties.emit(customProperty);
  }

  nodeIsEditable(): boolean {
    if (!this.workPackageIsEditable || this.nodeCategory === 'copy') {
      return true;
    }
    return false;
  }
}
