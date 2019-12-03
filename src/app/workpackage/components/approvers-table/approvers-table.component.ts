import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-approvers-table',
  templateUrl: './approvers-table.component.html',
  styleUrls: ['./approvers-table.component.scss']
})
export class ApproversTableComponent {
  @Input()
  set data(data: WorkPackageDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
    }
  }

  public displayedColumns: string[] = ['name', 'status'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;
}
