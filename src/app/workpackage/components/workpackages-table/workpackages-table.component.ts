import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail, WorkPackageEntity, TableData, Page } from '@app/workpackage/store/models/workpackage.models';
import { Roles } from '@app/core/directives/by-role.directive';

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkPackagesTableComponent implements AfterViewInit {
  public Roles = Roles;
  public filterValue: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() selectedRowIndex: string | number = -1;
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
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



  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['archive', 'name', 'status', 'owners', 'approvers'];
  public page: Page;

  @Output()
  workpackageSelected = new EventEmitter<WorkPackageDetail>();

  @Output()
  addWorkpackage = new EventEmitter<void>();

  @Output() pageChange = new EventEmitter<{
    previousPageIndex: number;
    pageIndex: number;
    pageSize: number;
    length: number;
  }>();

  @Output() search = new EventEmitter<string>();


  ngAfterViewInit() {
    this.paginator.page.subscribe(nextPage => {
      // debugger;
      this.pageChange.emit(nextPage);
    });
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
}
