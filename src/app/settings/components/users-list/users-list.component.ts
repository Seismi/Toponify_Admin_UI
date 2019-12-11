import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TeamDetails } from '@app/settings/store/models/team.model';
import { MatTableDataSource } from '@angular/material';
import { User } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-users-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.scss']
})
export class UsersListComponent {
  public selectedRowIndex: string | number = -1;

  @Input()
  set data(data: TeamDetails[]) {
    this.dataSource = new MatTableDataSource<TeamDetails>(data);
  }

  public dataSource: MatTableDataSource<TeamDetails>;
  public displayedColumns: string[] = ['firstName', 'email'];

  @Output() memberSelect = new EventEmitter<User>();

  onSelectRow(user: User): void {
    this.selectedRowIndex = user.id;
    this.memberSelect.emit(user);
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
