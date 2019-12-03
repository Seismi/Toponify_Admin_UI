import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageEntity } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-owners-list',
  templateUrl: './owners-list.component.html',
  styleUrls: ['./owners-list.component.scss']
})
export class OwnersListComponent {
  selectedRowIndex = -1;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageEntity>;

  @Output()
  selectOwner = new EventEmitter();

  onSelect(row) {
    this.selectedRowIndex = row.id;
    this.selectOwner.emit(row);
  }
}
