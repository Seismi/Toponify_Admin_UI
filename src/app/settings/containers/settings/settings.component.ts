import { Component, OnDestroy, OnInit } from '@angular/core';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { State as UserState } from '../../store/reducers/user.reducer';
import { User, UserDetails } from '@app/settings/store/models/user.model';
import { LoadUsers, UpdateUser, AddUser, UpdateUserPassword } from '@app/settings/store/actions/user.actions';
import { getUsers, getLoading, getUserById } from '@app/settings/store/selectors/user.selector';
import {
  LoadTeams,
  LoadTeam,
  AddTeam,
  UpdateTeam,
  DeleteTeam,
  DeleteMember,
  AddMember
} from '@app/settings/store/actions/team.actions';
import { TeamEntity, TeamDetails } from '@app/settings/store/models/team.model';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { getTeamEntities, getTeamSelected } from '@app/settings/store/selectors/team.selector';
import { TeamDetailService } from '@app/settings/components/team-detail/services/team-detail.service';
import { TeamValidatorService } from '@app/settings/components/team-detail/services/team-detail-validator.service';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { DeleteTeamAndMemberModalComponent } from '../delete-modal/delete-modal.component';
import { MemberModalComponent } from '../member-modal/member-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password.component';
import { State as HomeState } from '@app/home/store/reducers/home.reducers';
import { LoadMyProfile } from '@app/home/store/actions/home.actions';
import { getMyProfile } from '@app/home/store/selectors/home.selectors';

@Component({
  selector: 'smi-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss'],
  providers: [MyUserFormService, MyUserFormValidatorService, TeamDetailService, TeamValidatorService]
})
export class SettingsComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  users$: Observable<User[]>;
  teams$: Observable<TeamEntity[]>;
  selectedTeam: TeamDetails;
  users: User[];
  user: UserDetails;
  showButtons = true;
  teamSelected = false;
  team: TeamEntity[];
  teamId: string;
  teamModal = false;
  isTeamEditable = false;
  subscriptions: Subscription[] = [];
  isActive = false;
  editMode = false;
  selectedTeams = [];
  selectedRoles = [];

  constructor(
    private homeStore: Store<HomeState>,
    private userStore: Store<UserState>,
    private teamStore: Store<TeamState>,
    private teamDetailService: TeamDetailService,
    private myUserFormService: MyUserFormService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading$ = this.userStore.pipe(select(getLoading));

    this.userStore.dispatch(new LoadUsers({}));
    this.teamStore.dispatch(new LoadTeams({}));

    this.users$ = this.userStore.pipe(select(getUsers));
    this.teams$ = this.teamStore.pipe(select(getTeamEntities));

    this.homeStore.dispatch(new LoadMyProfile());
    this.subscriptions.push(
      this.homeStore.pipe(select(getMyProfile)).subscribe(data => {
        this.user = data;
        if (data) {
          this.myUserFormService.myUserForm.patchValue({ ...data });
        }
      })
    );
  }

  get myUserForm(): FormGroup {
    return this.myUserFormService.myUserForm;
  }

  get teamDetailForm(): FormGroup {
    return this.teamDetailService.teamDetailForm;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  onSelectTab() {
    this.editMode = false;
  }

  onEditUser(userId: string) {
    this.subscriptions.push(
      this.userStore.pipe(select(getUserById(userId))).subscribe(users => {
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
        this.userStore.dispatch(new UpdateUser({ id: userId, data: data.user }));
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
        this.userStore.dispatch(
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

  onSelectTeam(row) {
    this.teamSelected = true;
    this.teamId = row.id;

    this.teamStore.dispatch(new LoadTeam(this.teamId));
    this.teamStore.pipe(select(getTeamSelected)).subscribe(team => {
      this.selectedTeam = team;
      if (this.selectedTeam) {
        this.teamDetailService.teamDetailForm.patchValue({
          name: this.selectedTeam.name,
          description: this.selectedTeam.description
        });
      }
    });
  }

  onSelectMember(member) {
    //
  }

  onNewTeam() {
    const dialogRef = this.dialog.open(TeamModalComponent, {
      disableClose: false,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.teamStore.dispatch(new AddTeam(data.team));
      }
    });
  }

  onEditTeam() {
    this.isTeamEditable = true;
  }

  onDeleteTeam() {
    const dialogRef = this.dialog.open(DeleteTeamAndMemberModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.teamStore.dispatch(new DeleteTeam(this.teamId));
      }
      this.teamSelected = false;
    });
  }

  onDeleteMember(memberId) {
    const dialogRef = this.dialog.open(DeleteTeamAndMemberModalComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        mode: 'delete'
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.mode === 'delete') {
        this.teamStore.dispatch(new DeleteMember({ teamId: this.teamId, userId: memberId }));
      }
    });
  }

  onSaveTeam() {
    this.isTeamEditable = false;
    this.teamStore.dispatch(
      new UpdateTeam({
        id: this.teamId,
        data: {
          id: this.teamId,
          name: this.teamDetailForm.value.name,
          description: this.teamDetailForm.value.description,
          type: 'team'
        }
      })
    );
  }

  onCancelEdit() {
    this.isTeamEditable = false;
  }

  onAddMember() {
    const dialogRef = this.dialog.open(MemberModalComponent, {
      disableClose: false,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.member) {
        this.teamStore.dispatch(
          new AddMember({
            data: data.member,
            teamId: this.teamId,
            userId: data.member.id
          })
        );
      }
    });
  }
}
