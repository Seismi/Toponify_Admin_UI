import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ScopeEntity } from '@app/scope/store/models/scope.model';

@Component({
  selector: 'smi-scopes-and-layouts-table',
  templateUrl: './scopes-and-layouts-table.component.html',
  styleUrls: ['./scopes-and-layouts-table.component.scss']
})
export class ScopesAndLayoutsTableComponent {
  public selectedRowIndex: string | number = -1;

  @Input() title: string;
  @Input() defaultLayoutId: string;

  @Input()
  set data(data: ScopeEntity[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<ScopeEntity>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<ScopeEntity>;

  @Output() select = new EventEmitter<ScopeEntity>();
  @Output() add = new EventEmitter<void>();
  @Output() setFavoriteLayout = new EventEmitter<string>();

  onSelectRow(row: ScopeEntity): void {
    this.selectedRowIndex = row.id;
    this.select.emit(row);
  }

  onAdd(): void {
    this.add.emit();
  }

  setFavorite(id: string) {
    console.log('set favorite', id);
    this.setFavoriteLayout.emit(id);
  }
}
