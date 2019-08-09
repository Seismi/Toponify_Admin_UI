import { Component, OnInit, ViewChild } from '@angular/core';
import { MyUserFormService } from '@app/settings/components/my-user-form/services/my-user-form.service';
import { MyUserFormValidatorService } from '@app/settings/components/my-user-form/services/my-user-form-validator.service';
import { Observable, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { UsersTableComponent } from '@app/settings/components/users-table/users-table.component';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { State as UserState} from '../../store/reducers/user.reducer'
import { User } from '@app/settings/store/models/user.model';
import { LoadUsers, UpdateUser, AddUser } from '@app/settings/store/actions/user.actions';
import { getUsers, getLoading, getUserById } from '@app/settings/store/selectors/user.selector';
import { LoadTeams, LoadTeam, AddTeam, UpdateTeam, DeleteTeam } from '@app/settings/store/actions/team.actions';
import { TeamEntity, TeamDetails } from '@app/settings/store/models/team.model';
import { State as TeamState } from '../../store/reducers/team.reducer';
import { getTeamEntities, getTeamSelected } from '@app/settings/store/selectors/scope.selector';
import { TeamDetailService } from '@app/settings/components/team-detail/services/team-detail.service';
import { TeamValidatorService } from '@app/settings/components/team-detail/services/team-detail-validator.service';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { DeleteTeamAndMemberModalComponent } from '../delete-modal/delete-modal.component';
import { MemberModalComponent } from '../member-modal/member-modal.component';

@Component({
    selector: 'smi-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.scss'],
    providers: [MyUserFormService, MyUserFormValidatorService, TeamDetailService, TeamValidatorService]
})

export class SettingsComponent implements OnInit {

    loading$: Observable<boolean>;
    users$: Observable<User[]>;
    teams$: Observable<TeamEntity[]>
    teamDetails$: Observable<TeamDetails>
    userSubscription: Subscription;
    user: User[];
    showButtons = true;
    teamSelected = false;
    team: TeamEntity[];
    teamId: string;
    teamModal = false;
    isTeamEditable = false;
    selectedTeams = [];
    selectedRoles = [];

    get myUserForm(): FormGroup {
        return this.myUserFormService.myUserForm;
    }

    get teamDetailForm(): FormGroup {
        return this.teamDetailService.teamDetailForm;
    }

    constructor(
        private userStore: Store<UserState>,
        private teamStore: Store<TeamState>,
        private teamDetailService: TeamDetailService,
        private myUserFormService: MyUserFormService,
        public dialog: MatDialog) {}

    ngOnInit() {
        this.loading$ = this.userStore.pipe(select(getLoading));

        this.userStore.dispatch(new LoadUsers({}));
        this.teamStore.dispatch(new LoadTeams({}));

        this.users$ = this.userStore.pipe(select(getUsers));
        this.teams$ = this.teamStore.pipe(select(getTeamEntities));
    }

    ngOnDestroy() {
        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }
    }

    @ViewChild(UsersTableComponent) AllUsersTableComponent: UsersTableComponent;


    onSearchUser(filterValue: string){
        this.AllUsersTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
    }


    onEditUser(id: string){
        this.userSubscription = this.userStore.pipe(select(getUserById(id))).subscribe(value => {
            this.user = value;
        });

        const dialogRef = this.dialog.open(UserModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
              mode: 'edit',
              user: {...this.user[0]},
              selectedTeams: this.selectedTeams,
              selectedRoles: this.selectedRoles
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.userStore.dispatch(new UpdateUser({
                  id: id,
                  data: {
                    id: id,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    phone: data.user.phone,
                    roles: this.selectedRoles,
                    team: this.selectedTeams,
                    email: data.user.email,
                    password: data.user.password,
                    userStatus: data.user.userStatus
                  }
              }));
            }
            this.selectedTeams = [];
            this.selectedRoles = [];
        });
    }


    onAddUser(){
        const dialogRef = this.dialog.open(UserModalComponent, {
            disableClose: false,
            width: 'auto',
            data: {
                mode: 'add',
                selectedTeams: this.selectedTeams,
                selectedRoles: this.selectedRoles
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
            if (data && data.user) {
              this.userStore.dispatch(new AddUser({
                    id: null,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    email: data.user.email,
                    phone: data.user.phone,
                    team: this.selectedTeams,
                    roles: this.selectedRoles,
                    password: data.user.password,
                    userStatus: data.user.userStatus
              }));
            }
            this.selectedTeams = [];
            this.selectedRoles = [];
        });
    }


    onSelectTeam(row) {
        this.teamSelected = true;
        this.teamId = row.id;

        this.teamStore.dispatch(new LoadTeam(this.teamId));
        this.teamDetails$ = this.teamStore.pipe(select(getTeamSelected));

        this.teamDetailService.teamDetailForm.patchValue({
            name: row.name
        })
    }


    onSelectMember(member) {
        //
    }


    onNewTeam() {
        const dialogRef = this.dialog.open(TeamModalComponent, {
            disableClose: false,
            width: '400px'
        });

        dialogRef.afterClosed().subscribe((data) => {
            if(data) {
                this.teamStore.dispatch(new AddTeam(data.team))
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

        dialogRef.afterClosed().subscribe((data) => {
            if (data.mode === 'delete') {
                this.teamStore.dispatch(new DeleteTeam(this.teamId));
            }
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
    }


    onSaveTeam() {
        this.isTeamEditable = false;
        this.teamStore.dispatch(new UpdateTeam({
            id: this.teamId,
            data: {
                id: this.teamId,
                name: this.teamDetailForm.value.name,
                description: this.teamDetailForm.value.description,
                type: 'team'
            }
        }))
    }


    onCancelEdit() {
        this.isTeamEditable = false;
    }


    onAddMember() {
        const dialogRef = this.dialog.open(MemberModalComponent, {
            disableClose: false
        });
    }
    
}
