import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Dimension } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-dimensions-table',
  templateUrl: 'dimensions-table.component.html',
  styleUrls: ['dimensions-table.component.scss']
})
export class ReportDimensionsTableComponent {
  @Input()
  set data(data: Dimension[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<Dimension>(data);
  }

  @Input() edit: boolean;
  @Output() dimensionEdit = new EventEmitter<Dimension>();

  public dataSource: MatTableDataSource<Dimension>;
  public displayedColumns: string[] = ['name', 'filter', 'reportingConcepts'];

  getConcepts(data) {
    return data.reportingConcepts.map(concept => concept.name).join(', ');
  }

  onDimensionEdit(dimension: Dimension) {
    this.dimensionEdit.emit(dimension);
  }
}
