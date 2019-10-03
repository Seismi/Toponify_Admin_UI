import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AttributesEntity } from '@app/report-library/store/models/report.model';

@Component({
  selector: 'smi-attributes-table-in-reports-page',
  templateUrl: 'attributes-table.component.html',
  styleUrls: ['attributes-table.component.scss']
})
export class AttributesTableInReportsPageComponent {
  @Input()
  set data(data: AttributesEntity[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<AttributesEntity>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<AttributesEntity>;
  public displayedColumns: string[] = ['category', 'name', 'description'];
}
