import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-data-set-table',
  templateUrl: 'data-set-table.component.html',
  styleUrls: ['data-set-table.component.scss']
})
export class ReportDataSetTableComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name'];
}