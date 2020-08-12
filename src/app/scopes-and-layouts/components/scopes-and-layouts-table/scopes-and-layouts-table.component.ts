import { Component, ViewChild, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ScopeEntity, Page, defaultScopeId } from '@app/scope/store/models/scope.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smi-scopes-and-layouts-table',
  templateUrl: './scopes-and-layouts-table.component.html',
  styleUrls: ['./scopes-and-layouts-table.component.scss']
})
export class ScopesAndLayoutsTableComponent implements AfterViewInit, OnDestroy {
  public selectedRowIndex: string | number = -1;
  public defaultScopeId = defaultScopeId;
  public subscriptions: Subscription[] = [];

  @Input() title: string;
  @Input() defaultLayoutId: string;
  @Input() showPagination: boolean;

  @Input()
  set data(data: ScopeEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<ScopeEntity>(data);
    }
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @Input()
  set pagination(pagination: Page) {
    if (pagination) {
      this.page = pagination;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<ScopeEntity>;
  public page: Page;

  @Output() setScopeAsFavorite = new EventEmitter<string>();
  @Output() unsetScopeAsFavorite = new EventEmitter<string>();
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

  @Output() sortChange = new EventEmitter<{
    sortOrder: string;
    sortBy: string;
  }>();

  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      this.pageChange.emit(nextPage);
    });

    this.subscriptions.push(
      this.sort.sortChange.subscribe(data => {
        const { active, direction } = data;
        this.sortChange.emit({
          sortOrder: direction,
          sortBy: active
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
