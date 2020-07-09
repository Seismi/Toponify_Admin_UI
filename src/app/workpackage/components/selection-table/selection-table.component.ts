import { Component, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { WorkPackageEntity, Page } from '@app/workpackage/store/models/workpackage.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'smi-selection-table',
  templateUrl: './selection-table.component.html',
  styleUrls: ['./selection-table.component.scss']
})
export class SelectionTableComponent implements AfterViewInit {
  @Input() loading: Observable<boolean>;
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
    }
  }

  @Input()
  set pagination(pagination: Page) {
    if (pagination) {
      this.page = pagination;
    }
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['select', 'name'];
  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public selection = new SelectionModel<WorkPackageEntity>(true, []);
  public page: Page;

  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  @Output() search = new EventEmitter<string>();

  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      this.pageChange.emit(nextPage);
    });
  }

  onSearch(filterValue: string): void {
    this.search.emit(filterValue.trim().toLowerCase());
    this.paginator.firstPage();
  }
}
