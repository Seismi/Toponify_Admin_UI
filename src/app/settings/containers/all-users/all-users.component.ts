import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState } from '../../store/reducers/user.reducer';
import { LoadUsers, UpdateUser, AddUser } from '@app/settings/store/actions/user.actions';
import { getUsers, getUserById } from '@app/settings/store/selectors/user.selector';
import { MatDialog } from '@angular/material';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'smi-all-users',
  templateUrl: 'all-users.component.html',
  styleUrls: ['all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  public users$: Observable<User[]>;
  public users: User[];
  public subscriptions: Subscription[] = [];
  public selectedTeams = [];
  public selectedRoles = [];

  constructor(
    private store: Store<UserState>,
    private dialog: MatDialog
  ) { }

  ngOnInit() { 
    this.store.dispatch(new LoadUsers({}));
    this.users$ = this.store.pipe(select(getUsers));
  }

  onEditUser(userId: string) {
    this.subscriptions.push(
      this.store.pipe(select(getUserById(userId))).subscribe(users => {
        this.users = users;
      })
    );

    const dialogRef = this.dialog.open(UserModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'edit',
        user: { ...this.users[0] }
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.user) {
        this.store.dispatch(new UpdateUser({ id: userId, data: data.user }));
      }
    });
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'add',
        selectedTeams: this.selectedTeams,
        selectedRoles: this.selectedRoles
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.user) {
        this.store.dispatch(
          new AddUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone,
            team: this.selectedTeams,
            roles: this.selectedRoles,
            password: 'P!ssw4rd',
            userStatus: 'active'
          })
        );
      }
      this.selectedTeams = [];
      this.selectedRoles = [];
    });
  }

}