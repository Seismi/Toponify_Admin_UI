import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/nodes/store/models/node.model';

@Component({
  selector: 'smi-workpackage-tab',
  templateUrl: './workpackage-tab.component.html',
  styleUrls: ['./workpackage-tab.component.scss']
})
export class WorkPackageTabComponent {

  @Input()
  set data(data: NodeDetail[]) {
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'status'];

  onSelectRow(workpackage) {}

}