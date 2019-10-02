import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CustomPropertyValues } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-properties-table-in-reports-page',
  templateUrl: 'properties-table.component.html',
  styleUrls: ['properties-table.component.scss']
})
export class PropertiesTableInReportsPageComponent {
  @Input()
  set data(data: CustomPropertyValues[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<CustomPropertyValues>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<CustomPropertyValues>;
  public displayedColumns: string[] = ['name', 'value'];
}
