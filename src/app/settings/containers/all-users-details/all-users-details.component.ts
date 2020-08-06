import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadUser, UpdateUser, LoadUserRoles, UserActionTypes, DeleteUserRole, AddUserRole, ResetPassword } from '@app/settings/store/actions/user.actions';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { getUserSelected, getUserRolesEntities, getUsers } from '@app/settings/store/selectors/user.selector';
import { RolesEntity, UserDetails } from '@app/settings/store/models/user.model';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { Actions, ofType } from '@ngrx/effects';
import isEqual from 'lodash.isequal';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Roles } from '@app/core/directives/by-role.directive';
import { SelectModalComponent } from '@app/core/layout/components/select-modal/select-modal.component';
import { map, take } from 'rxjs/operators';
import { AddMember, DeleteMember, TeamActionTypes } from '@app/settings/store/actions/team.actions';
import { DeleteModalComponent } from '@app/core/layout/components/delete-modal/delete-modal.component';
import { ResetPasswordModalComponent } from '../reset-password-modal/reset-password-modal.component';
import { getMyProfile } from '@app/home/store/selectors/home.selectors';

@Component({
  selector: 'app-all-users-details',
  templateUrl: './all-users-details.component.html',
  styleUrls: ['./all-users-details.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})
export class AllUsersDetailsComponent implements OnInit, OnDestroy {
  public loggedInUser: UserDetails;
  public team: TeamEntity[];
  public role: RolesEntity[];
  public subscriptions: Subscription[] = [];
  public user: any;
  public isEditable = false;
  public userStatus: string;
  public administrators: string[];
  public userRoles: string[];
  public Roles = Roles;

  constructor(
    private actions: Actions,
    private myUserFormService: MyUserFormService,
    private route: ActivatedRoute,
    private store: Store<UserState>,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.actions.pipe(ofType(
        TeamActionTypes.AddMemberSuccess,
        TeamActionTypes.DeleteMemberSuccess,
        UserActionTypes.UpdateUserSuccess)).subscribe(_ => {
          this.store.dispatch(new LoadUser(this.user.id));
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(getUsers)).subscribe(users => {
        if (users) {
          const userRoles = [];
          users.forEach(user => {
            const roles = user.roles.map(role => role.name).join(' ');
            userRoles.push(roles);
          });
          this.administrators = userRoles.filter(userRole => userRole.indexOf(Roles.ADMIN) === 0);
        }
      })
    );

    this.subscriptions.push(
      this.route.params.subscribe(params => {
        const userId = params['userId'];
        this.store.dispatch(new LoadUser(userId));
        this.store.dispatch(new LoadUserRoles());
      })
    );

    this.subscriptions.push(this.store.pipe(select(getTeamEntities)).subscribe(team => (this.team = team)));

    this.subscriptions.push(this.store.pipe(select(getUserRolesEntities)).subscribe(role => (this.role = role)));

    this.subscriptions.push(
      this.store.pipe(select(getUserSelected)).subscribe(data => {
        if (data) {
          this.user = data;
          this.userRoles = data.roles.map(role => role.name);
          this.myUserFormService.myUserForm.patchValue({ ...data, settings: {} });
          this.isEditable = false;
          data.userStatus === 'active' ? (this.userStatus = 'Deactivate') : (this.userStatus = 'Activate');
        }
      })
    );

    this.subscriptions.push(
      this.actions.pipe(ofType(UserActionTypes.UpdateUserSuccess)).subscribe((action: any) => {
        const userRoles = this.user.roles.map(role => role.name);
        const roles = action.payload.roles.map(role => role.name);
        const status = action.payload.userStatus;
        status === 'active' ? (this.userStatus = 'Deactivate') : (this.userStatus = 'Activate');
        const rolesHasChanged = isEqual(roles, userRoles);
        if (!rolesHasChanged) {
          this.snackBar.open('To see changes to roles, the user must refresh the page in his local browser');
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getMyProfile)).subscribe(profile => (this.loggedInUser = profile))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  onEditUser(): void {
    this.isEditable = true;
  }

  onSaveUser(): void {
    if (this.myUserForm.invalid) {
      return;
    }
    this.store.dispatch(new UpdateUser({ id: this.user.id, data: this.myUserForm.value }));
    this.isEditable = false;
  }

  onCancelEdit(): void {
    this.isEditable = false;
  }

  onDeleteUser(): void {
    this.store.dispatch(
      new UpdateUser({
        id: this.user.id,
        data: {
          id: this.user.id,
          userStatus: this.setUserStatus(this.userStatus)
        }
      })
    );
  }

  setUserStatus(status: string): string {
    return status === 'Deactivate' ? 'disabled' : 'active';
  }

  onAddTeam(): void {
    const ids = new Set(this.user.team.map(({ id }) => id));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Add Teams',
        options$: this.store.pipe(select(getTeamEntities)).pipe(map(data => data.filter(({ id }) => !ids.has(id)))),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddMember({
            data: data.value,
            teamId: data.value[0].id,
            userId: this.user.id
          })
        );
      }
    });
  }

  onAddRole(): void {
    const ids = new Set(this.user.roles.map(({ id }) => id));
    const dialogRef = this.dialog.open(SelectModalComponent, {
      disableClose: false,
      width: '500px',
      data: {
        title: 'Add Roles',
        options$: this.store.pipe(select(getUserRolesEntities)).pipe(map(data => data.filter(({ id }) => !ids.has(id)))),
        selectedIds: []
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.value) {
        this.store.dispatch(
          new AddUserRole({
            userId: this.user.id,
            roleId: data.value[0].id
          })
        );
      }
    });
  }

  onRemoveTeamOrRole(entity: { id: string, type: string }): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      disableClose: false,
      data: {
        title: 'Are you sure you want to un-associate?'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (entity.type === 'team') {
          this.store.dispatch(
            new DeleteMember({
              teamId: entity.id,
              userId: this.user.id
            })
          );
        } else {
          this.store.dispatch(
            new DeleteUserRole({
              userId: this.user.id,
              roleId: entity.id
            })
          );
        }
      }
    });
  }

  resetPassword(): void {
    this.store.dispatch(new ResetPassword({ email: this.user.email }));
    this.actions
      .pipe(
        take(1),
        ofType(UserActionTypes.ResetPasswordSuccess)
      )
      .subscribe((action) => {
        if (action) {
          this.dialog.open(ResetPasswordModalComponent);
        }
    });
  }
}
