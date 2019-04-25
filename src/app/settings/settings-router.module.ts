import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationSettingsComponent } from './containers/organisation-settings/organisation-settings.component';
import { SettingsRoutingComponent } from './settings-router.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsRoutingComponent,
    children: [
      {
        path: '',
        component: OrganisationSettingsComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
