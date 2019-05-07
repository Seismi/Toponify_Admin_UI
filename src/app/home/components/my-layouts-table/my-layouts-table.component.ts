import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface PeriodicElement {
  scope: string;
  layout: string;
  access: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {scope: 'Default', layout: 'Default', access: 'Public'},
  {scope: 'Finance', layout: 'Accounts lineage', access: 'Private'},
  {scope: 'EPM', layout: 'My view', access: 'Private'},
  {scope: 'Finance', layout: 'EMP focus', access: 'Private'},
  {scope: 'HR', layout: 'Default', access: 'Private'},
];

@Component({
  selector: 'smi-my-layouts-table',
  templateUrl: './my-layouts-table.component.html',
  styleUrls: ['./my-layouts-table.component.scss']
})
export class MyLayoutsTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['scope', 'layout', 'access', 'star'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}