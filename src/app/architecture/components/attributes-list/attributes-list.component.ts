import { Component, Input, EventEmitter, Output } from '@angular/core';
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

  public dataSource: MatTableDataSource<AttributeEntity>;
  public displayedColumns: string[] = ['category', 'name'];

  @Output() attributeSelect = new EventEmitter<AttributeEntity>();

  onSelectRow(attribute: AttributeEntity): void {
    this.selectedRowIndex = attribute.id;
    this.attributeSelect.emit(attribute);
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}