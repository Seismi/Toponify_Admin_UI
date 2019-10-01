import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { OwnersEntity } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-report-owners-table',
  templateUrl: 'owners-table.component.html',
  styleUrls: ['owners-table.component.scss']
})
export class ReportOwnersTableComponent {
  @Input()
  set data(data: OwnersEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<OwnersEntity>(data);
  }

  public dataSource: MatTableDataSource<OwnersEntity>;
  public displayedColumns: string[] = ['name'];
}
