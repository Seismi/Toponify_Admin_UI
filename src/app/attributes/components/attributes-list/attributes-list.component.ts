import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AttributeEntity } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.scss']
})
export class AttributesListComponent {

  public selectedRowIndex: string | number = -1;

  @Input()
  set data(data: AttributeEntity[]) {
    this.dataSource = new MatTableDataSource<AttributeEntity>(data);
  }

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<AttributeEntity>;

  @Output() selectAttribute = new EventEmitter<AttributeEntity>();

  onSelect(attribute: AttributeEntity): void {
    this.selectedRowIndex = attribute.id;
    this.selectAttribute.emit(attribute);
  }

}