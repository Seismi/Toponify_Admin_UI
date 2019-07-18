import { Component, Input, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { WorkPackageDetail } from '@app/workpackage/store/models/workpackage.models';

@Component({
  selector: 'smi-baseline-table',
  templateUrl: './baseline-table.component.html',
  styleUrls: ['./baseline-table.component.scss']
})
export class BaselineTableComponent {

  @Input() isEditable = false;
  selectedRowIndex = -1;
  selectedBaseline = false;

  @Input()
  set data(data: any[]) {
    this.dataSource = new MatTableDataSource<any>(data);
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<WorkPackageDetail>;

  onSelect(row) {
    this.selectedBaseline = true;
    this.selectedRowIndex = row.id;
  }

  onAdd() {

  }

  onDelete() {

  }
}