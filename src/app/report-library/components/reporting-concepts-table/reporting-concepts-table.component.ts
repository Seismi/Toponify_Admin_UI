import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-reporting-concepts-table',
  templateUrl: 'reporting-concepts-table.component.html',
  styleUrls: ['reporting-concepts-table.component.scss']
})
export class ReportReportingConceptsTableComponent {
  @Input()
  set data(data: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity>(data);
  }

  public dataSource: MatTableDataSource<DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity>;
  public displayedColumns: string[] = ['name'];
}
