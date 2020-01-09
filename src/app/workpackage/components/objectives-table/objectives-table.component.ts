import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-objectives-table',
  templateUrl: './objectives-table.component.html',
  styleUrls: ['./objectives-table.component.scss']
})
export class ObjectivesTableComponent {
  @Input()
  set data(data: WorkPackageDetail[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<WorkPackageDetail>(data);
      this.dataSource.paginator = this.paginator;
    }
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public displayedColumns: string[] = ['name', 'description'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() addObjective = new EventEmitter<void>();
  @Output() deleteObjective = new EventEmitter<string>();
  @Output() editRadio = new EventEmitter<WorkPackageDetail>();

  onAdd(): void {
    this.addObjective.emit();
  }

  onDelete(id: string): void {
    this.deleteObjective.emit(id);
  }

  onMove(radio: WorkPackageDetail): void {
    this.editRadio.emit(radio);
  }
}
