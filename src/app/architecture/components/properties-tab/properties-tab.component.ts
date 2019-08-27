import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';

@Component({
  selector: 'smi-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class PropertiesTabComponent {

  @Input() workPackageIsEditable: boolean;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<NodeDetail>;
  displayedColumns: string[] = ['name', 'value', 'edit'];

  @Output()
  editProperties = new EventEmitter();

  onEdit(id: string) {
    this.editProperties.emit(id);
  }
}