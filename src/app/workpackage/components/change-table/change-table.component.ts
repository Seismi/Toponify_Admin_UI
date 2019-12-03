import { Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-change-table',
  templateUrl: './change-table.component.html',
  styleUrls: ['./change-table.component.scss']
})
export class ChangeTableComponent {
  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['change', 'layer', 'object'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;
}
