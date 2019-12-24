import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-dimensions-table',
  templateUrl: 'dimensions-table.component.html',
  styleUrls: ['dimensions-table.component.scss']
})
export class ReportDimensionsTableComponent {
  @Input()
  set data(data: DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity>(data);
  }

  public dataSource: MatTableDataSource<DataSetsEntityOrDimensionsEntityOrReportingConceptsEntity>;
  public displayedColumns: string[] = ['name', 'filter', 'reportingConcepts'];

  getConcepts(data) {
    return data.reportingConcepts.map(concept => concept.name).join(', ');
  }
}
