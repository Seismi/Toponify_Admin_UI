import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { SettingsRoutingComponent } from './settings-router.component';
import { SettingsRoutingModule } from './settings-router.module';
import { OrganisationSettingsComponent } from './containers/organisation-settings/organisation-settings.component';

@NgModule({
  imports: [
    SettingsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreModule],
  exports: [],
  declarations: [SettingsRoutingComponent, OrganisationSettingsComponent],
  providers: [],
})
export class SettingsModule { }
