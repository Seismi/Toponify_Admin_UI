import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = ['category', 'name', 'description'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
}