import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';
import { CustomPropertiesEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-properties-table-in-attributes-page',
  templateUrl: 'properties-table.component.html',
  styleUrls: ['properties-table.component.scss']
})
export class PropertiesTableInAttributesPageComponent {

  @Input() workPackageIsEditable: boolean;

  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<AttributeDetail>;
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