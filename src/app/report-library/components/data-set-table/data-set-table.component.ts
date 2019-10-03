import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-data-set-table',
  templateUrl: 'data-set-table.component.html',
  styleUrls: ['data-set-table.component.scss']
})
export class ReportDataSetTableComponent {
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
