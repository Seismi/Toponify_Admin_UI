import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail, WorkPackageEntity, TableData, Page } from '@app/workpackage/store/models/workpackage.models';
import { Roles } from '@app/core/directives/by-role.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkPackagesTableComponent implements AfterViewInit, OnDestroy  {
  private subscriptions: Subscription[] = [];
  public Roles = Roles;
  public filterValue: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() selectedRowIndex: string | number = -1;
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
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



  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['archive', 'name', 'status', 'owners', 'approvers'];
  public page: Page;

  @Output() refresh = new EventEmitter<string>();
  @Output() workpackageSelected = new EventEmitter<WorkPackageDetail>();
  @Output() addWorkpackage = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  @Output() search = new EventEmitter<string>();

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

  onSelectRow(row: WorkPackageDetail): void {
    this.workpackageSelected.emit(row);
  }

  onAdd(): void {
    this.addWorkpackage.emit();
  }

  getOwners(data: WorkPackageEntity): string {
    return data.owners.map(owner => owner.name).join('; ');
  }

  getApprovers(data: WorkPackageEntity): string {
    return data.approvers.map(approver => approver.name).join('; ');
  }


  onSearch(filterValue: string): void {
    this.search.emit(filterValue.trim().toLowerCase());
    this.paginator.firstPage();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
