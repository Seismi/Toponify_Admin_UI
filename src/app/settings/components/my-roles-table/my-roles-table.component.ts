import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserDetails } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-my-roles-table',
  templateUrl: './my-roles-table.component.html',
  styleUrls: ['./my-roles-table.component.scss']
})
export class MyRolesTableComponent {

  selectedRowIndex = -1;
  @Input() isEditable = false;
  @Input() selectedRole = false;

  @Input()
  set data(data: any[]) {
    if(data) {
      this.dataSource = new MatTableDataSource<any>(data);
    }
  }

  displayedColumns: string[] = ['name'];
  public dataSource: MatTableDataSource<UserDetails>;

  @Output()
  addRole = new EventEmitter();

  @Output()
  deleteRole = new EventEmitter();

  @Output()
  selectRole = new EventEmitter();

  onSelect(row) {
    this.selectRole.emit(row);
  }

  onAdd() {
    this.addRole.emit();
  }

  onDelete() {
    this.deleteRole.emit();
  }
}