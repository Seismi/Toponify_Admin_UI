import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface PeriodicElement {
    name: string;
    owners: string;
}
  
const ELEMENT_DATA: PeriodicElement[] = [
    {owners: '', name: 'Default'},
    {owners: 'FSS', name: 'Finance Systems'},
    {owners: 'FSS', name: 'Statutory Reporting'}
];

@Component({
  selector: 'smi-scopes-table',
  templateUrl: './scopes-table.component.html',
  styleUrls: ['./scopes-table.component.scss']
})
export class ScopesTableComponent {

    selectedRowIndex: number = -1;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    ngOnInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    displayedColumns: string[] = ['name', 'owners'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @Output()
    scopeSelected = new EventEmitter();

    onSelectRow(row) {
      this.selectedRowIndex = row.name;
      this.scopeSelected.emit(row);
    }
}