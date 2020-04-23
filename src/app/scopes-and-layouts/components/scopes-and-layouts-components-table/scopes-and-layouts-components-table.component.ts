import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'smi-scopes-and-layouts-components-table',
  templateUrl: './scopes-and-layouts-components-table.component.html',
  styleUrls: ['./scopes-and-layouts-components-table.component.scss']
})
export class ScopesAndLayoutsComponentsTableComponent {
  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['layer', 'name'];
  public dataSource: MatTableDataSource<any>;

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
