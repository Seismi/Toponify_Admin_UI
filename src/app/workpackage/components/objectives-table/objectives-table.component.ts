import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-objectives-table',
  templateUrl: './objectives-table.component.html',
  styleUrls: ['./objectives-table.component.scss']
})
export class ObjectivesTableComponent  {

  @Input() statusDraft: boolean = false;

  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  displayedColumns: string[] = ['type', 'name', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output()
  deleteObjective = new EventEmitter();

  onDelete(radio) {
    this.deleteObjective.emit(radio)
  }
}