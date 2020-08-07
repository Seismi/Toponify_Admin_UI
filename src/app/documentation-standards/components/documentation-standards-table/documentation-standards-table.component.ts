import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { DocumentStandard, Page } from '@app/documentation-standards/store/models/documentation-standards.model';
import { Roles } from '@app/core/directives/by-role.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smi-documentation-standards-table',
  templateUrl: 'documentation-standards-table.component.html',
  styleUrls: ['documentation-standards-table.component.scss']
})
export class DocumentationStandardsTableComponent implements AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public selectedRowIndex: string | number = -1;
  public Roles = Roles;
  public page: Page;

  @ViewChild('searchField') input: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  set data(data: DocumentStandard[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<DocumentStandard>(data);
    }
  }

  public dataSource: MatTableDataSource<DocumentStandard> = new MatTableDataSource<DocumentStandard>([]);
  @Input() displayedColumns: string[] = ['name', 'levels'];

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  @Input()
  set pagination(pagination: Page) {
    if (pagination) {
      this.page = pagination;
    }
  }

  @Output() refresh = new EventEmitter<string>();
  @Output() documentSelected = new EventEmitter<DocumentStandard>();
  @Output() addDocument = new EventEmitter<void>();
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
    this.subscriptions.push(
      this.paginator.page.subscribe(nextPage => {
        this.pageChange.emit(nextPage);
      })
    );

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

  onSelectRow(documentStandard: DocumentStandard): void {
    this.selectedRowIndex = documentStandard.id;
    this.documentSelected.emit(documentStandard);
  }

  onAdd(): void {
    this.addDocument.emit();
  }

  onSearch(filterValue: string): void {
    this.search.emit(filterValue.trim().toLowerCase());
    this.paginator.firstPage();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
