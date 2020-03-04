import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-components-table',
  templateUrl: './components-table.component.html',
  styleUrls: ['./components-table.component.scss']
})
export class ComponentsTableComponent {
  @Input() title: string;
  @Input()
  set data(data: NodeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<NodeDetail>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = ['name', 'arrow-up', 'arrow-down', 'actions'];
}