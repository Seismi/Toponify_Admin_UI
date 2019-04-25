import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoutingComponent } from './containers/user-routing.component';
import { UserManagerComponent } from './containers/user-manager/user-manager.component';
import { UserDetailComponent } from './containers/userDetail/user-deta.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserRoutingComponent,
    children: [
      {
        path: '',
        component: UserManagerComponent
      },
      {
        path: ':id',
        component: UserDetailComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
