import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { MyUserFormService } from '../../components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '../../components/my-user-form/services/my-user-form-validator.service';
import { User, RolesEntity } from '@app/settings/store/models/user.model'
import { Store, select } from '@ngrx/store';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { LoadTeams } from '@app/settings/store/actions/team.actions';
import { TeamEntity } from '@app/settings/store/models/team.model';
import { Observable } from 'rxjs';
import { getTeamEntities } from '@app/settings/store/selectors/team.selector';
import { State as UserState } from '../../store/reducers/user.reducer';
import { LoadUserRoles } from '@app/settings/store/actions/user.actions';
import { getUserRolesEntities } from '@app/settings/store/selectors/user.selector';

@Component({
  selector: 'smi-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService]
})

export class UserModalComponent implements OnInit {

  teams$: Observable<TeamEntity[]>;
  roles$: Observable<RolesEntity[]>;
  showButtons = false;
  isActive = true;
  disableEmailInput = false;
  public mode: string;
  public isEditMode: boolean;
  user: User;
  selectedTeams = [];
  selectedRoles = [];

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  constructor(
    private store: Store<TeamState>,
    private userStore: Store<UserState>,
    private myUserFormService: MyUserFormService,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any) {
    this.mode = data.mode;
    this.user = data.user;
    this.selectedTeams = data.selectedTeams;
    this.selectedRoles = data.selectedRoles;
    (this.mode === 'edit')
      ? this.isEditMode = true
      : this.isEditMode = false;
  }
  
  ngOnInit() {
    this.store.dispatch(new LoadTeams({}));
    this.teams$ = this.store.pipe(select(getTeamEntities));

    this.userStore.dispatch(new LoadUserRoles());
    this.roles$ = this.userStore.pipe(select(getUserRolesEntities))

    if(this.isEditMode){
      this.disableEmailInput = true;
      this.myUserFormService.myUserForm.patchValue({...this.user});
    }
  }

  onSubmit(data: any) {
    if (!this.myUserFormService.isValid) {
      return;
    }
    this.dialogRef.close({ 
      user: this.myUserForm.value, 
      mode: this.mode, 
      selectedRoles: this.selectedRoles, 
      selectedTeams: this.selectedTeams 
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}