import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NodeDetail, CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class PropertiesTabComponent {
  @Input() workPackageIsEditable: boolean;

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
  public displayedColumns: string[] = ['name', 'value', 'edit'];

  @Output()
  editProperties = new EventEmitter<CustomPropertyValuesEntity>();

  onEdit(customProperty: CustomPropertyValuesEntity) {
    this.editProperties.emit(customProperty);
  }
}
