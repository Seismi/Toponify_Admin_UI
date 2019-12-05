import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { Store, select } from '@ngrx/store';
import { State as HomeState } from '@app/home/store/reducers/home.reducers';
import { getMyProfile } from '@app/home/store/selectors/home.selectors';
import { UserDetails } from '@app/settings/store/models/user.model';
import { UpdateUser, UpdateUserPassword } from '@app/settings/store/actions/user.actions';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password.component';
import { MatDialog } from '@angular/material';
import { State as UserState } from '@app/settings/store/reducers/user.reducer';
import { LoadMyProfile } from '@app/home/store/actions/home.actions';

@Component({
  selector: 'smi-my-user',
  templateUrl: 'my-user.component.html',
  styleUrls: ['my-user.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})
export class MyUserComponent implements OnInit {

  public user: UserDetails;
  public showButtons = true;
  public isActive = false;
  public editMode = false;

  constructor(
    private store: Store<HomeState>,
    private userStore: Store<UserState>,
    private myUserFormService: MyUserFormService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.store.dispatch(new LoadMyProfile());
    this.store.pipe(select(getMyProfile)).subscribe(data => {
      if (data) {
        this.user = data;
        this.myUserFormService.myUserForm.patchValue({ ...data });
      }
    })
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  onSaveMyUser() {
    this.isActive = false;
    this.editMode = false;
    this.userStore.dispatch(new UpdateUser({ id: this.user.id, data: this.myUserForm.value }));
  }

  onEditMyUser() {
    this.isActive = true;
    this.editMode = true;
  }

  onChangePassword() {
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