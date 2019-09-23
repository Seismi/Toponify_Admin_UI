import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-workpackage-tab',
  templateUrl: './workpackage-tab.component.html',
  styleUrls: ['./workpackage-tab.component.scss']
})
export class WorkPackageTabComponent {
  @Input()
  set data(data: NodeDetail[]) {
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = ['name', 'status'];
}
