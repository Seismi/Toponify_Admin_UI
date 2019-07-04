import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface PeriodicElement {
    id: string;
    name: string;
    owners: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {id: '387d1706-9255-11e9-bc42-526af7764f64', owners: '', name: 'Default'},
    {id: '387d19e0-9255-11e9-bc42-526af7764f64', owners: 'FSS', name: 'Budget Cycle'},
    {id: '387d1b34-9255-11e9-bc42-526af7764f64', owners: 'FSS', name: 'Conslidation process'}
];

@Component({
  selector: 'smi-layouts-table',
  templateUrl: './layouts-table.component.html',
  styleUrls: ['./layouts-table.component.scss']
})
export class LayoutsTableComponent {

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
    layoutSelected = new EventEmitter();

    onSelectRow(row) {
      this.selectedRowIndex = row.name;
      this.layoutSelected.emit(row);
    }
}