import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ReportLibrary } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-library-table',
  templateUrl: 'report-library-table.component.html',
  styleUrls: ['report-library-table.component.scss']
})
export class ReportLibraryTableComponent implements OnInit {
  private filterValue: string;
  @Input()
  set reports(reports: ReportLibrary[]) {
    if (reports) {
      this.dataSource = new MatTableDataSource<ReportLibrary>(reports);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filter = this.filterValue;
    }
  }

  @Input() workPackageIsEditable: boolean;

  @Output() reportSelected = new EventEmitter<ReportLibrary>();
  @Output() addReport = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  public dataSource: MatTableDataSource<ReportLibrary>;
  public displayedColumns: string[] = ['name', 'description', 'tags'];
  public selectedRowId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {}

  onSelectRow(row: ReportLibrary) {
    this.selectedRowId = row.id;
    this.reportSelected.emit(row);
  }

  onAdd() {
    this.addReport.emit();
  }

  onSearch(filterValue: string): void {
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  downloadCSV(): void {
    this.download.emit();
  }
}
