import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './settings-router.module';
import { SettingsComponent } from './containers/settings/settings.component';
import {
  MatTabsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { MyUserFormComponent } from './components/my-user-form/my-user-form.component';
import { OrganisationComponent } from './components/organisation/organisation.component';
import { ChangePasswordFormComponent } from './components/change-password-form/change-password-form.component';
import { ChangePasswordModalComponent } from './containers/change-password-modal/change-password.component';
import { UserModalComponent } from './containers/user-modal/user-modal.component';
import { UserService } from './services/user.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer as UserReducer } from './store/reducers/user.reducer';
import { reducer as TeamReducer } from './store/reducers/team.reducer';
import { UserEffects } from './store/effects/user.effects';
import { TeamService } from '@app/settings/services/team.service';
import { TeamEffects } from './store/effects/team.effects';
import { TeamsTableComponent } from './components/teams-table/teams-table.component';
import { TeamDetailComponent } from './components/team-detail/team-detail.component';
import { MembersTableComponent } from './components/members-table/members-table.component';
import { TeamModalComponent } from './containers/team-modal/team-modal.component';
import { DeleteTeamAndMemberModalComponent } from './containers/delete-modal/delete-modal.component';
import { MemberModalComponent } from './containers/member-modal/member-modal.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { HomeModule } from '@app/home/home.module';
import { MyUserComponent } from './containers/my-user/my-user.component';
import { TeamsComponent } from './containers/teams/teams.component';
import { AllUsersComponent } from './containers/all-users/all-users.component';
import { OrganisationsComponent } from './containers/organisations/organisations.component';
import { SettingsTabsComponent } from './components/settings-tabs/settings-tabs.component';
import { SettingsRightSideComponent } from './components/right-side/right-side.component';
import { AllUsersDetailsComponent } from './containers/all-users-details/all-users-details.component';

@NgModule({
  imports: [
    SettingsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HomeModule,
    CoreModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    StoreModule.forFeature('userFeature', UserReducer),
    StoreModule.forFeature('teamFeature', TeamReducer),
    EffectsModule.forFeature([UserEffects, TeamEffects])
  ],
  exports: [],
  declarations: [
    SettingsComponent,
    UsersTableComponent,
    MyUserFormComponent,
    OrganisationComponent,
    ChangePasswordFormComponent,
    ChangePasswordModalComponent,
    UserModalComponent,
    TeamsTableComponent,
    TeamDetailComponent,
    MembersTableComponent,
    TeamModalComponent,
    DeleteTeamAndMemberModalComponent,
    MemberModalComponent,
    UsersListComponent,
    MyUserComponent,
    TeamsComponent,
    AllUsersComponent,
    OrganisationsComponent,
    SettingsTabsComponent,
    SettingsRightSideComponent,
    AllUsersDetailsComponent
  ],
  entryComponents: [
    ChangePasswordModalComponent,
    UserModalComponent,
    TeamModalComponent,
    DeleteTeamAndMemberModalComponent,
    MemberModalComponent
  ],
  providers: [UserService, TeamService]
})
export class SettingsModule {}
