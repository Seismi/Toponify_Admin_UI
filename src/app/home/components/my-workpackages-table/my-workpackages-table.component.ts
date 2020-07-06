import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-my-workpackages-table',
  templateUrl: './my-workpackages-table.component.html',
  styleUrls: ['./my-workpackages-table.component.scss']
})
export class MyWorkpackagesTableComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageEntity>;

  @Output() openWorkPackage = new EventEmitter<string>();

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
