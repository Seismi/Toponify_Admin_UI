import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import {WorkPackageDetail, Baseline, currentArchitecturePackageId} from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-baseline-table',
  templateUrl: './baseline-table.component.html',
  styleUrls: ['./baseline-table.component.scss']
})
export class BaselineTableComponent {
  @Input() isEditable = false;
  public currentState = currentArchitecturePackageId;

  @Input()
  set data(data: WorkPackageDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
    }
  }

  public displayedColumns: string[] = ['name', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() add = new EventEmitter<void>();
  @Output() delete = new EventEmitter<any>();

  onAdd(): void {
    this.add.emit();
  }

  onDelete(baseline: Baseline): void {
    this.delete.emit(baseline);
  }
}
