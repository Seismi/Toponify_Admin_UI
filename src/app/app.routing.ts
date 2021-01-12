import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'instances',
        pathMatch: 'full'
      },
      {
        path: 'instances',
        loadChildren: './instances/instances.module#InstancesModule'
      },
      {
        path: 'customers',
        loadChildren: './customers/customers.module#CustomersModule'
      },
      {
        path: 'users',
        loadChildren: './users/users.module#UsersModule'
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: 'instances',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
