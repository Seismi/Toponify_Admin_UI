import { Component, Input } from '@angular/core';
import { NodeDetail } from '@app/nodes/store/models/node.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-attributes-tab',
  templateUrl: './attributes-tab.component.html',
  styleUrls: ['./attributes-tab.component.scss']
})
export class AttributesTabComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['category', 'name'];

  onSelectRow(attribute) {}

}