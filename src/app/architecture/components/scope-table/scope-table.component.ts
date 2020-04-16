import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageNodeScopes } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-scope-table',
  templateUrl: './scope-table.component.html',
  styleUrls: ['./scope-table.component.scss']
})
export class ScopeTableComponent {
  @Input() nodeCategory: string;

  @Input()
  set data(data: WorkPackageNodeScopes[]) {
    if (!data) {
      data = [];
    }
    this.dataSource = new MatTableDataSource<WorkPackageNodeScopes>(data);
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {}

  public dataSource: MatTableDataSource<WorkPackageNodeScopes>;
  public displayedColumns: string[] = ['name', 'icons'];

  @Output() delete = new EventEmitter<WorkPackageNodeScopes>();
  @Output() addExistingScope = new EventEmitter<void>();
  @Output() newScope = new EventEmitter<void>();

  onDelete(scope: WorkPackageNodeScopes) {
    this.delete.emit(scope);
  }

  onAdd(): void {
    this.addExistingScope.emit();
  }

  onNew(): void {
    this.newScope.emit();
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
