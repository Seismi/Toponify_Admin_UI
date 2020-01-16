import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as UserState } from '../../store/reducers/user.reducer';
import { LoadUsers, AddUser } from '@app/settings/store/actions/user.actions';
import { getUsers } from '@app/settings/store/selectors/user.selector';
import { MatDialog } from '@angular/material';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'smi-all-users',
  templateUrl: 'all-users.component.html',
  styleUrls: ['all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  public users$: Observable<User[]>;

  constructor(private router: Router, private store: Store<UserState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadUsers({}));
    this.users$ = this.store.pipe(select(getUsers));
  }

  onAddUser(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      disableClose: false,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.user) {
        this.store.dispatch(
          new AddUser({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone,
            team: data.user.team,
            roles: data.user.roles,
            password: 'P!ssw4rd',
            userStatus: 'active'
          })
        );
      }
    });
  }

  onSelectUser(user: User): void {
    this.router.navigate([`/settings/all-users/${user.id}`]);
  }
}
