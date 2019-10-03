import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RelatedWorkPackages } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-workpackage-table-in-reports-page',
  templateUrl: 'workpackage-table.component.html',
  styleUrls: ['workpackage-table.component.scss']
})
export class WorkPackageTableInReportsPageComponent {
  @Input()
  set data(data: RelatedWorkPackages[]) {
    this.dataSource = new MatTableDataSource<RelatedWorkPackages>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<RelatedWorkPackages>;
  public displayedColumns: string[] = ['name', 'status'];
}
