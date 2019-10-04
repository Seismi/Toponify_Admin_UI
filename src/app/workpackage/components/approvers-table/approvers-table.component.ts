import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-approvers-table',
  templateUrl: './approvers-table.component.html',
  styleUrls: ['./approvers-table.component.scss']
})
export class ApproversTableComponent {

  selectedRowIndex = -1;
  
  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
  }

  displayedColumns: string[] = ['name', 'status'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;
}