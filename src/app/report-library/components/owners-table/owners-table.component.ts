import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Report } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-owners-table',
  templateUrl: 'owners-table.component.html',
  styleUrls: ['owners-table.component.scss']
})
export class ReportOwnersTableComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<Report>;
  public displayedColumns: string[] = ['name'];
}