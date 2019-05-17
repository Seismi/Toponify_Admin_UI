import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ReportLibrary } from '@app/report-library/store/models/report.model';


@Component({
  selector: 'smi-report-library-table',
  templateUrl: 'report-library-table.component.html',
  styleUrls: ['report-library-table.component.scss']
})
export class ReportLibraryTableComponent implements OnInit {

  @Input()
  set reports(reports: ReportLibrary[]) {
    this.dataSource = new MatTableDataSource<ReportLibrary>(reports);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public dataSource: MatTableDataSource<ReportLibrary>;
  public displayedColumns: string[] = ['name', 'dataSets'];
  public selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
  }


  @Output()
  reportSelected = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.name;
    this.reportSelected.emit(row);
  }

}