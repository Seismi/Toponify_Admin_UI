import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-dimensions-table',
  templateUrl: 'dimensions-table.component.html',
  styleUrls: ['dimensions-table.component.scss']
})
export class ReportDimensionsTableComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name'];
}