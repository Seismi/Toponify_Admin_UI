import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class PropertiesTabComponent {

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'value'];

  onSelectRow(property) {}

}