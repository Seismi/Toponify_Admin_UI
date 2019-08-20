import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-properties-table-in-reports-page',
  templateUrl: 'properties-table.component.html',
  styleUrls: ['properties-table.component.scss']
})
export class PropertiesTableInReportsPageComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name', 'value'];
}