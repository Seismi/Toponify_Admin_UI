import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-workpackage-table-in-reports-page',
  templateUrl: 'workpackage-table.component.html',
  styleUrls: ['workpackage-table.component.scss']
})
export class WorkPackageTableInReportsPageComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name', 'status'];
}