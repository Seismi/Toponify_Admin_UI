import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export interface PeriodicElement {
    name: string;
    owners: string;
}
  
const ELEMENT_DATA: PeriodicElement[] = [
    {owners: '', name: 'Default'},
    {owners: 'FSS', name: 'Budget Cycle'},
    {owners: 'FSS', name: 'Conslidation process'}
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