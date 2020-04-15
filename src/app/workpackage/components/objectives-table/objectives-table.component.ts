import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Objective } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-objectives-table',
  templateUrl: './objectives-table.component.html',
  styleUrls: ['./objectives-table.component.scss']
})
export class ObjectivesTableComponent {
  @Input()
  set data(data: Objective[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<Objective>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name', 'description'];
  public dataSource: MatTableDataSource<Objective>;

  @Output() addObjective = new EventEmitter<void>();
  @Output() deleteObjective = new EventEmitter<Objective>();
  @Output() moveObjective = new EventEmitter<Objective>();

  onAdd(): void {
    this.addObjective.emit();
  }

  onDelete(objective: Objective): void {
    this.deleteObjective.emit(objective);
  }

  onMove(objective: Objective): void {
    this.moveObjective.emit(objective);
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
