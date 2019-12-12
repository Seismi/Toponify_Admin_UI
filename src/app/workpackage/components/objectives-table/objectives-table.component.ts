import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';
import { RadioEntity } from '@app/radio/store/models/radio.model';

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

  public displayedColumns: string[] = ['refNo', 'name', 'status', 'edit', 'delete'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output() addObjective = new EventEmitter<void>();
  @Output() deleteObjective = new EventEmitter<RadioEntity>();
  @Output() editRadio = new EventEmitter<WorkPackageDetail>();

  onAdd(): void {
    this.addObjective.emit();
  }

  onDelete(radio: RadioEntity): void {
    this.deleteObjective.emit(radio);
  }

  onEdit(radio: WorkPackageDetail): void {
    this.editRadio.emit(radio);
  }
}
