import { Component, ViewChild, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ScopeEntity, Page } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-scopes-and-layouts-table',
  templateUrl: './scopes-and-layouts-table.component.html',
  styleUrls: ['./scopes-and-layouts-table.component.scss']
})
export class ScopesAndLayoutsTableComponent implements AfterViewInit {
  public selectedRowIndex: string | number = -1;

  @Input() title: string;
  @Input() defaultLayoutId: string;
  @Input() showPagination: boolean;

  @Input()
  set data(data: ScopeEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<ScopeEntity>(data);
      this.dataSource.sort = this.sort;
    }
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @Input()
  set pagination(pagination: Page) {
    if (pagination) {
      console.log(pagination)
      this.page = pagination;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<ScopeEntity>;
  public page: Page;

  @Output() refresh = new EventEmitter<string>();
  @Output() select = new EventEmitter<ScopeEntity>();
  @Output() add = new EventEmitter<void>();
  @Output() setFavoriteLayout = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  ngAfterViewInit() {
    console.log('here');
    this.paginator.page.subscribe(nextPage => {
      this.pageChange.emit(nextPage);
    });
  }

  onSelectRow(row: ScopeEntity): void {
    this.selectedRowIndex = row.id;
    this.select.emit(row);
  }

  onAdd(): void {
    this.add.emit();
  }

  setFavorite(id: string) {
    console.log('set favorite', id);
    this.setFavoriteLayout.emit(id);
  }

  onSearch(filterValue: string): void {
    this.search.emit(filterValue.trim().toLowerCase());
  }
  
}
