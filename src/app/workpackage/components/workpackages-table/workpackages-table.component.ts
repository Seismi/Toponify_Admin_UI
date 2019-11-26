import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { WorkPackageEntity, WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkPackagesTableComponent implements OnInit {

  @Input()
  set data(data: WorkPackageEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public selectedRowIndex: string | number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {}

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['name', 'status', 'owners', 'approvers'];


  @Output()
  workpackageSelected = new EventEmitter<WorkPackageDetail>();

  @Output()
  addWorkpackage = new EventEmitter<void>();

  onSelectRow(row: WorkPackageDetail): void {
    this.selectedRowIndex = row.id;
    this.workpackageSelected.emit(row);
  }

  onAdd(): void {
    this.addWorkpackage.emit();
  }

}