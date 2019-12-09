import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './containers/settings/settings.component';
import { MyUserComponent } from './containers/my-user/my-user.component';
import { TeamsComponent } from './containers/teams/teams.component';
import { AllUsersComponent } from './containers/all-users/all-users.component';
import { OrganisationsComponent } from './containers/organisations/organisations.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'my-user',
        component: MyUserComponent,
      },
      {
        path: 'teams',
        component: TeamsComponent,
      },
      {
        path: 'all-users',
        component: AllUsersComponent
      },
      {
        path: 'organisation',
        component: OrganisationsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
