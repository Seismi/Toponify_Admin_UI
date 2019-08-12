import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-baseline-table',
  templateUrl: './baseline-table.component.html',
  styleUrls: ['./baseline-table.component.scss']
})
export class BaselineTableComponent {

  @Input() selectedRowIndex = -1;
  @Input() isEditable = false;
  @Input() selectedBaseline = false;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;


  @Output()
  addBaseline = new EventEmitter();

  @Output()
  deleteBaseline = new EventEmitter();

  @Output()
  selectBaseline = new EventEmitter();

  onSelect(row) {
    this.selectedRowIndex = row.id;
    this.selectBaseline.emit(row);
  }

  onAdd() {
    this.addBaseline.emit();
  }

  onDelete() {
    this.deleteBaseline.emit();
  }
}