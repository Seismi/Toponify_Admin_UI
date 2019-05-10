import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';


@Component({
  selector: 'smi-workpackages-table',
  templateUrl: './workpackages-table.component.html',
  styleUrls: ['./workpackages-table.component.scss']
})
export class WorkPackagesTableComponent implements OnInit {

  @Input()
  set data(data: WorkPackageEntity[]) {
    this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {}

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  public displayedColumns: string[] = ['name', 'status', 'owners'];

  selectedRowIndex: number = -1;

  @Output()
  workpackageSelected = new EventEmitter();

  @Output()
  addWorkpackage = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.id;
    this.workpackageSelected.emit(row);
  }

  onAdd() {
    this.addWorkpackage.emit();
  }

}