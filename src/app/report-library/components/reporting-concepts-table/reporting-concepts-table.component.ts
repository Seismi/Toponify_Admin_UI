import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-reporting-concepts-table',
  templateUrl: 'reporting-concepts-table.component.html',
  styleUrls: ['reporting-concepts-table.component.scss']
})
export class ReportReportingConceptsTableComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name'];
}