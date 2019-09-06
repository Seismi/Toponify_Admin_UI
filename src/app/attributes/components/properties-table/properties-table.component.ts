import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-properties-table-in-attributes-page',
  templateUrl: 'properties-table.component.html',
  styleUrls: ['properties-table.component.scss']
})
export class PropertiesTableInAttributesPageComponent {
  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<AttributeDetail>;
  public displayedColumns: string[] = ['name', 'value'];
}