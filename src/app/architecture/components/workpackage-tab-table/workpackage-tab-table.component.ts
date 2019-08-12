import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent {
  @Input()
  set data(data: WorkPackageEntity[]) {
    this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
  }

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  displayedColumns: string[] = ['show', 'name', 'c', 'e', 'd'];

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter<object>();

  onSelect(id, event) {
    this.selectWorkPackage.emit(id);
  }

  onSelectColor(color, id) {
    this.selectColor.emit({color, id});
  }
}