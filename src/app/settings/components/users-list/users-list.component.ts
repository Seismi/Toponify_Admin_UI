import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeamDetails } from '@app/settings/store/models/team.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'smi-users-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.scss']
})
export class UsersListComponent {

  selectedRowIndex: number = -1;

  @Input()
  set data(data: TeamDetails[]) {
    this.dataSource = new MatTableDataSource<TeamDetails>(data);
  }

  public dataSource: MatTableDataSource<TeamDetails>;
  displayedColumns: string[] = ['firstName', 'email'];

  @Output()
  memberSelect = new EventEmitter();

  onSelectRow(row) {
    this.selectedRowIndex = row.id;
    this.memberSelect.emit(row);
  }

}