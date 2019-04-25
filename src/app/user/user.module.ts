import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { UserRoutingComponent } from './containers/user-routing.component';
import { RouterModule } from '@angular/router';
import { UserRoutingModule } from './user-routing.module';
import { UserManagerComponent } from './containers/user-manager/user-manager.component';
import { UserDetailComponent } from './containers/userDetail/user-deta.component';
import { AllUsersComponent } from './containers/user-manager/all-users/all-users.component';
import { MyUserFormComponent } from './containers/user-manager/my-user/my-user-form/my-user-form.component';
import { MyUserComponent } from './containers/user-manager/my-user/my-user.component';
import { OrganisationComponent } from './containers/user-manager/organisation/organisation.component';
import { AllUsersTableComponent } from './containers/user-manager/all-users/all-users-table/all-users-table.component';
import { EditUsersModalComponent } from './containers/user-manager/all-users/edit-users-modal/edit-users-modal.component';
import { ChangeUserPasswordComponent } from './containers/user-manager/my-user/change-password-modal/change-password.component';
import {
  ChangePasswordFormComponent
} from './containers/user-manager/my-user/change-password-modal/change-password-form/change-password-form.component';
import { UserService } from './services/user.service';
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

import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducers/user.reducer';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';

@NgModule({
  imports: [
    UserRoutingModule,
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
    EffectsModule.forFeature([UserEffects])],
  exports: [],
  declarations: [
    UserRoutingComponent,
    UserManagerComponent,
    UserDetailComponent,
    AllUsersComponent,
    MyUserFormComponent,
    MyUserComponent,
    OrganisationComponent,
    AllUsersTableComponent,
    EditUsersModalComponent,
    ChangeUserPasswordComponent,
    ChangePasswordFormComponent
  ],
  providers: [UserService],
  entryComponents: [EditUsersModalComponent, ChangeUserPasswordComponent]
})

export class UserModule { }
