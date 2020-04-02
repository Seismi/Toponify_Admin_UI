import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { User } from '@app/settings/store/models/user.model';

@Component({
  selector: 'smi-users-table',
  templateUrl: 'users-table.component.html',
  styleUrls: ['users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  public selectedUserIndex: string | number = -1;

  @Input()
  set data(data: User[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<User>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  public displayedColumns: string[] = ['firstName', 'lastName', 'roles', 'team'];
  public dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() addUser = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<User>();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  onAdd(): void {
    this.addUser.emit();
  }

  onSelect(user: User): void {
    this.selectedUserIndex = user.id;
    this.selectUser.emit(user);
  }

  onSearch(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
