import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-baseline-table',
  templateUrl: './baseline-table.component.html',
  styleUrls: ['./baseline-table.component.scss']
})
export class BaselineTableComponent {

  @Input()
  set data(data: WorkPackageDetail[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
    }
  }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

}