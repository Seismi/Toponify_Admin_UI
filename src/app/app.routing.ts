import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/app-layouts/main-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],

    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
      },
      {
        path: 'version',
        loadChildren: './version/version.module#VersionModule'
      },
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'scopes-and-layouts',
        loadChildren: './scopes-and-layouts/scopes-and-layouts.module#ScopesAndLayoutsModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: 'version',
    pathMatch: 'full'
  }
];

@NgModule({
  // https://angular.io/guide/router#preloading-background-loading-of-feature-areas
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      paramsInheritanceStrategy: 'always',
      enableTracing: false
      /*preloadingStrategy: PreloadAllModules*/
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
