import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { Store, select } from '@ngrx/store';
import { State as HomeState } from '@app/home/store/reducers/home.reducers';
import { getMyProfile } from '@app/home/store/selectors/home.selectors';
import { UserDetails, TeamEntity, RolesEntity } from '@app/settings/store/models/user.model';
import { UpdateUser, UpdateUserPassword, LoadUserRoles } from '@app/settings/store/actions/user.actions';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password.component';
import { MatDialog } from '@angular/material';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadMyProfile } from '@app/home/store/actions/home.actions';
import { Subscription } from 'rxjs';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { getUserRolesEntities } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'smi-my-user',
  templateUrl: 'my-user.component.html',
  styleUrls: ['my-user.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})
export class MyUserComponent implements OnInit {
  public user: UserDetails;
  public showButtons = true;
  public isEditable = false;
  public modalMode = false;
  public subscriptions: Subscription[] = [];
  public team: TeamEntity[];
  public role: RolesEntity[];
  public formValue: any;

  constructor(
    private store: Store<HomeState>,
    private userStore: Store<UserState>,
    private myUserFormService: MyUserFormService,
    private dialog: MatDialog
  ) {
    this.myUserForm.valueChanges.subscribe(value => this.formValue = value);
  }

  ngOnInit() {
    this.store.dispatch(new LoadMyProfile());
    this.store.dispatch(new LoadUserRoles());
    this.store.pipe(select(getMyProfile)).subscribe(data => {
      this.user = data;
      if (data) {
        this.myUserFormService.myUserForm.patchValue({ ...data });
      }
    });

    this.subscriptions.push(this.store.pipe(select(getTeamEntities)).subscribe(team => (this.team = team)));

    this.subscriptions.push(this.store.pipe(select(getUserRolesEntities)).subscribe(role => (this.role = role)));
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  onSaveUser(): void {
    if (this.myUserForm.invalid) {
      return;
    }
    this.isEditable = false;
    this.userStore.dispatch(new UpdateUser({ id: this.user.id, data: this.myUserForm.value }));
  }

  onEditUser(): void {
    this.isEditable = true;
  }

  onCancelEdit(): void {
    this.isEditable = false;
  }

  onChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.beforeClosed().subscribe(data => {
      if (data && data) {
        this.userStore.dispatch(
          new UpdateUserPassword({
            userId: this.user.id,
            oldPassword: data.user.oldPassword,
            newPassword: data.user.newPassword
          })
        );
      }
    });
  }
}
