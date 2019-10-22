import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { NodeDetail } from '@app/architecture/store/models/node.model';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-radio-properties-tab',
  templateUrl: './properties-tab.component.html',
  styleUrls: ['./properties-tab.component.scss']
})
export class RadioPropertiesTabComponent {
  @Input()
  set data(data: NodeDetail[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<NodeDetail>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<NodeDetail>;
  public displayedColumns: string[] = ['name', 'value', 'edit', 'delete'];

  @Output() editProperty = new EventEmitter<CustomPropertiesEntity>();
  @Output() deleteProperty = new EventEmitter<CustomPropertiesEntity>();

  onEdit(property: CustomPropertiesEntity) {
    this.editProperty.emit(property);
  }

  onDelete(property: CustomPropertiesEntity) {
    this.deleteProperty.emit(property);
  }
  
}