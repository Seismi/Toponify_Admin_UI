import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { AttributeDetail } from '@app/attributes/store/models/attributes.model';

@Component({
  selector: 'smi-workpackage-table-in-attributes-page',
  templateUrl: 'workpackage-table.component.html',
  styleUrls: ['workpackage-table.component.scss']
})
export class WorkPackageTableInAttributesPageComponent {
  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<AttributeDetail>;
  public displayedColumns: string[] = ['name', 'status'];
}
