import { Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
  category: string;
  name: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {category: 'Attribute', name: 'Income Statement', description: 'Date at which the report was run'},
  {category: 'Rule', name: 'Must balance', description: 'Data must balance'},
];

@Component({
  selector: 'smi-attr-and-rules-table',
  templateUrl: 'attr-and-rules-table.component.html',
  styleUrls: ['attr-and-rules-table.component.scss']
})
export class AttrAndRulesTableComponent  {

  @Input() reportSelected = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['category', 'name', 'description'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}