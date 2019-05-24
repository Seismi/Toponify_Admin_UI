import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './containers/settings/settings.component';
import { SettingsRoutingComponent } from './settings-router.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsRoutingComponent,
    children: [
      {
        path: '',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(settingsRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
