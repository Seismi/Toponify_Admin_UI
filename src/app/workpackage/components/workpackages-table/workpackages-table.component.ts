import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail, WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkPackagesTableComponent implements OnInit {
  @Input() selectedRowIndex: string | number = -1;
  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['archive', 'name', 'status', 'owners', 'approvers'];

  @Output()
  workpackageSelected = new EventEmitter<WorkPackageDetail>();

  @Output()
  addWorkpackage = new EventEmitter<void>();

  ngOnInit(): void {}

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
}
