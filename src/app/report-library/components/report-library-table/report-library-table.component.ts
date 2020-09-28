import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Report, ReportLibrary } from '@app/report-library/store/models/report.model';
import { TableData, Page } from '@app/radio/store/models/radio.model';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-report-library-table',
  templateUrl: 'report-library-table.component.html',
  styleUrls: ['report-library-table.component.scss']
})
export class ReportLibraryTableComponent implements OnInit, AfterViewInit {
  @Input()
  set reports(data: TableData<ReportLibrary[]>) {
    this.dataSource = new MatTableDataSource<ReportLibrary>(data.entities as any);
    this.page = data.page;
    this.dataSource.sort = this.sort;
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @Input() workPackageIsEditable: boolean;
  @Input() workpackages: WorkPackageEntity[];

  @Output() refresh = new EventEmitter<string>();
  @Output() reportSelected = new EventEmitter<ReportLibrary>();
  @Output() addReport = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();

  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  public page: Page;

  @Output() filter = new EventEmitter<string>();

  public dataSource: MatTableDataSource<ReportLibrary>;
  public displayedColumns: string[] = ['name', 'description', 'tags', 'impactedBy'];
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
    this.filter.emit(filterValue);
  }

  downloadCSV(): void {
    this.download.emit();
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      this.pageChange.emit(nextPage);
    });
  }

  getWorkPackageName(report): string {
    return report.impactedByWorkPackages.map(wp => wp.name).join(', ');
  }

  getWorkPackageColour(workpackage: WorkPackageEntity) {
    return this.workpackages[0].displayColour ? this.workpackages[0].displayColour : '#000000';
  }
}
