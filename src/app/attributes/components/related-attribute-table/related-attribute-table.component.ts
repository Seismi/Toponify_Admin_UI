import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { AttributeDetail } from '../../store/models/attributes.model';

@Component({
  selector: 'smi-related-attribute-table',
  templateUrl: './related-attribute-table.component.html',
  styleUrls: ['./related-attribute-table.component.scss']
})
export class RelatedAttributeTableComponent {
  @Input() workPackageIsEditable: boolean;
  @Input()
  set data(data: AttributeDetail[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<AttributeDetail>(data);
  }

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<string>();

  public dataSource: MatTableDataSource<AttributeDetail>;
  public displayedColumns: string[] = ['name', 'actions'];
}
