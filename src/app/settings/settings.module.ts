import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { SettingsRoutingComponent } from './settings-router.component';
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
  MatDialogModule
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
import { reducer } from './store/reducers/user.reducer';
import { UserEffects } from './store/effects/user.effects';

@NgModule({
  imports: [
    SettingsRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
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
    StoreModule.forFeature('userFeature', reducer),
    EffectsModule.forFeature([UserEffects])
  ],
  exports: [],
  declarations: [
    SettingsRoutingComponent, 
    SettingsComponent,
    UsersTableComponent,
    MyUserFormComponent,
    OrganisationComponent,
    ChangePasswordFormComponent,
    ChangePasswordModalComponent,
    UserModalComponent
  ],
  entryComponents: [ChangePasswordModalComponent, UserModalComponent],
  providers: [UserService]
})
export class SettingsModule { }
