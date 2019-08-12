import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-owners-table',
  templateUrl: './owners-table.component.html',
  styleUrls: ['./owners-table.component.scss']
})
export class OwnersTableComponent {

  selectedRowIndex = -1;
  @Input() isEditable = false;
  @Input() selectedOwner = false;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  @Output()
  addOwner = new EventEmitter();

  @Output()
  deleteOwner = new EventEmitter();

  @Output()
  selectOwner = new EventEmitter();

  onSelect(row) {
    this.selectedRowIndex = row.id;
    this.selectOwner.emit(row);
  }

  onAdd() {
    this.addOwner.emit();
  }

  onDelete() {
    this.deleteOwner.emit();
  }
}