import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { CustomPropertyValuesEntity } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-properties-table',
  templateUrl: './properties-table.component.html',
  styleUrls: ['./properties-table.component.scss']
})
export class PropertiesTableComponent {
  @Input() statusDraft: boolean;

  @Input()
  set data(data: WorkPackageDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<WorkPackageDetail>;
  public displayedColumns: string[] = ['name', 'value', 'edit', 'delete'];

  @Output() editProperties = new EventEmitter<CustomPropertyValuesEntity>();
  @Output() deleteProperties = new EventEmitter<CustomPropertyValuesEntity>();

  onEdit(customProperty: CustomPropertyValuesEntity): void {
    this.editProperties.emit(customProperty);
  }

  onDelete(customProperty: CustomPropertyValuesEntity): void {
    this.deleteProperties.emit(customProperty);
  }
}
