import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

export interface PeriodicElement {
  name: string;
  levels: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Functional Design Document', levels: 'Systems (All)'},
  {name: 'Technical Design', levels: 'Data Sets Links (All)'},
];

@Component({
  selector: 'smi-documentation-standards-table',
  templateUrl: 'documentation-standards-table.component.html',
  styleUrls: ['documentation-standards-table.component.scss']
})
export class DocumentationStandardsTableComponent implements OnInit {

  selectedRowIndex: number = -1;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = ['name', 'levels'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @Output()
  documentationSelected = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.name;
    this.documentationSelected.emit(row);
  }

}