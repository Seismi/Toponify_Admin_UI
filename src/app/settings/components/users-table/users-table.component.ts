import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { User } from '@app/auth/store/models/user.model';

@Component({
  selector: 'smi-users-table',
  templateUrl: 'users-table.component.html',
  styleUrls: ['users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  @Input()
  set data(data: any[]) {
    if (data) {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  displayedColumns: string[] = ['firstName', 'lastName', 'roles', 'team'];
  public dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Users per page';
  }

  @Output()
  editUser = new EventEmitter<string>();

  @Output()
  addUser = new EventEmitter();


  onEdit(id: string) {
    this.editUser.emit(id);
  }

  onAddNewUser() {
    this.addUser.emit();
  }
}
