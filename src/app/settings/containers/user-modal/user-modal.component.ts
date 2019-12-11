import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '../../components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '../../components/my-user-form/services/my-user-form-validator.service';
import { User, RolesEntity } from '@app/settings/store/models/user.model';
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Observable } from 'rxjs';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as UserState } from '../../store/reducers/user.reducer';
import { getUserRolesEntities } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'smi-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService, { provide: MAT_DIALOG_DATA, useValue: {} }]
})
export class UserModalComponent implements OnInit {

  public teams$: Observable<TeamEntity[]>;
  public roles$: Observable<RolesEntity[]>;
  public user: User;
  public disableEmailInput: boolean = false;
  public modalMode: boolean = true;
  public isEditable: boolean = true;

  constructor(
    private store: Store<TeamState>,
    private userStore: Store<UserState>,
    private myUserFormService: MyUserFormService,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.user = data.user;
    }

  ngOnInit(): void {
    this.teams$ = this.store.pipe(select(getTeamEntities));
    this.roles$ = this.userStore.pipe(select(getUserRolesEntities));
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  onSubmit(): void {
    if (!this.myUserFormService.isValid) {
      return;
    }
    this.dialogRef.close({user: this.myUserForm.value});
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}