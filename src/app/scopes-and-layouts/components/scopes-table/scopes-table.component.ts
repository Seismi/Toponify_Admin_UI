import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ScopeEntity } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-scopes-table',
  templateUrl: './scopes-table.component.html',
  styleUrls: ['./scopes-table.component.scss']
})
export class ScopesTableComponent {

    selectedRowIndex: number = -1;

    @Input()
    set data(data: ScopeEntity[]) {
      this.dataSource = new MatTableDataSource<ScopeEntity>(data);
      //this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    }
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['name'];
    public dataSource: MatTableDataSource<ScopeEntity>;

    @Output()
    scopeSelected = new EventEmitter();

    @Output()
    addScope = new EventEmitter();

    onSelectRow(row) {
      this.selectedRowIndex = row.id;
      this.scopeSelected.emit(row);
    }

    onAdd() {
      this.addScope.emit();
    }
}