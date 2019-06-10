import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-workpackage-tab-table',
  templateUrl: './workpackage-tab-table.component.html',
  styleUrls: ['./workpackage-tab-table.component.scss']
})
export class WorkPackageTabTableComponent {

  checked = false;
  
  @Input()
  set data(data: WorkPackageEntity[]) {
    this.dataSource = new MatTableDataSource<WorkPackageEntity>(data);
  }

  public dataSource: MatTableDataSource<WorkPackageEntity>;
  displayedColumns: string[] = ['show', 'name', 'c', 'e', 'd'];

  @Output()
  selectWorkPackage = new EventEmitter();

  @Output()
  selectColor = new EventEmitter();

  onSelect(id, event) {
    if(event.checked) {
      this.selectWorkPackage.emit(id)
    }
  }

  onSelectColor(color) {
    this.selectColor.emit(color);
  }

}