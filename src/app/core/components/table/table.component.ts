import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

export interface TableData<T> {
  entities: T[];
  page: Page;
}

export interface Page {
  size: number;
  totalObjects: number;
  totalPages: number;
  number: number;
}

@Component({
  selector: 'smi-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit {
  public dataSource: MatTableDataSource<T>;
  public page: Page;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  set data(data: TableData<T>) {
    this.dataSource = new MatTableDataSource<T>(data.entities);
    this.page = data.page;
    this.dataSource.sort = this.sort;
  }

  get totalEntities(): number {
    return this.page ? this.page.totalObjects : 0;
  }

  constructor() {}

  ngOnInit() {}
}
