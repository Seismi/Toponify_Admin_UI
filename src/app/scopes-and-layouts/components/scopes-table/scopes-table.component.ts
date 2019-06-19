import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface PeriodicElement {
    id: string;
    name: string;
    owners: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {id: '436b885c-9253-11e9-bc42-526af7764f64', owners: '', name: 'Default'},
    {id: '436b8abe-9253-11e9-bc42-526af7764f64', owners: 'FSS', name: 'Finance Systems'},
    {id: '436b8c1c-9253-11e9-bc42-526af7764f64', owners: 'FSS', name: 'Statutory Reporting'}
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