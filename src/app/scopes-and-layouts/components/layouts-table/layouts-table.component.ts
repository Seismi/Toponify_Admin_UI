import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ScopeDetails } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-layouts-table',
  templateUrl: './layouts-table.component.html',
  styleUrls: ['./layouts-table.component.scss']
})
export class LayoutsTableComponent {

    selectedRowIndex: number = -1;

    @Input()
    set data(data: any[]) {
      this.dataSource = new MatTableDataSource<any>(data);
      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['name'];
    public dataSource: MatTableDataSource<ScopeDetails>;

    @Output()
    layoutSelected = new EventEmitter();

    onSelectRow(row) {
      this.selectedRowIndex = row.id;
      this.layoutSelected.emit(row);
    }
}