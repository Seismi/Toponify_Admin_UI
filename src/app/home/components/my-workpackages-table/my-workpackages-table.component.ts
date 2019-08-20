import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-my-workpackages-table',
  templateUrl: './my-workpackages-table.component.html',
  styleUrls: ['./my-workpackages-table.component.scss']
})
export class MyWorkpackagesTableComponent implements OnInit {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() { }

  displayedColumns: string[] = ['name', 'status', 'hasErrors', 'star'];
  public dataSource: MatTableDataSource<WorkPackageEntity>;

  @Output()
  openWorkPackage = new EventEmitter();

  onOpen(id) {
    this.openWorkPackage.emit(id);
  }
}