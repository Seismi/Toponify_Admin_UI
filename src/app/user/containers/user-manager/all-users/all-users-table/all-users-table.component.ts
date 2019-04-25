import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { EditUsersModalComponent } from '../edit-users-modal/edit-users-modal.component';
import { UserService } from '@app/user/services/user.service';
import { User } from '@app/user/store/models/user.model';

@Component({
    selector: 'smi-all-users-table',
    templateUrl: 'all-users-table.component.html',
    styleUrls: ['all-users-table.component.scss']
})
export class AllUsersTableComponent implements OnInit {

    @Input()
    set data(_data: User[]) {
      this.dataSource = new MatTableDataSource<User>(_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    displayedColumns: string[] = ['firstName', 'lastName', 'roles', 'team'];
    public dataSource: MatTableDataSource<User>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(public dialog: MatDialog, private userService: UserService) {}

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

    onAddNewUser(){
      this.addUser.emit();
    }

}
