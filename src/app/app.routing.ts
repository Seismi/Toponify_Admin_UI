import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/app-layouts/main-layout.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { ByRoleGuard } from './core/guards/by-role.guard';
import { Roles } from './core/directives/by-role.directive';

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
        path: 'report-library',
        loadChildren: './report-library/report-library.module#ReportLibraryModule'
      },
      {
        path: 'topology',
        loadChildren: './architecture/architecture.module#ArchitectureModule'
      },
      {
        path: 'documentation-standards',
        loadChildren: './documentation-standards/documentation-standards.module#DocumentationStandardsModule'
      },
      {
        path: 'work-packages',
        loadChildren: './workpackage/workpackage.module#WorkPackageModule'
      },
      {
        path: 'scopes-and-layouts',
        loadChildren: './scopes-and-layouts/scopes-and-layouts.module#ScopesAndLayoutsModule'
      },
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule',
        canActivate: [ByRoleGuard],
        data: {
          roles: [Roles.ADMIN, Roles.ARCHITECT, Roles.MEMBER]
        }
      },
      {
        path: 'radio',
        loadChildren: './radio/radio.module#RadioModule'
      },
      {
        path: 'attributes-and-rules',
        loadChildren: './attributes/attributes.module#AttributesModule'
      }
    ]
  },
  {
    path: 'error/:type',
    loadChildren: './core/error/error.module#ErrorModule'
  },
  {
    path: 'error',
    loadChildren: './core/error/error.module#ErrorModule'
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  // https://angular.io/guide/router#preloading-background-loading-of-feature-areas
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true,
      paramsInheritanceStrategy: 'always'
      /*preloadingStrategy: PreloadAllModules*/
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
