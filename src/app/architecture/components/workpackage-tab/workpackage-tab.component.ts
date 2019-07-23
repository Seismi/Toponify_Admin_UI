import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-workpackage-tab',
  templateUrl: './workpackage-tab.component.html',
  styleUrls: ['./workpackage-tab.component.scss']
})
export class WorkPackageTabComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'status'];

  onSelectRow(workpackage) {}

}