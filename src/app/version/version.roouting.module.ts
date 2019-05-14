import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VersionsManagerComponent } from './containers/versions-manager.component';
import { VersionModelComponent } from './containers/version-model.component';
import { VersionRoutingComponent } from './containers/version-routing.component';

export const versionRoutes: Routes = [
  {
    path: '',
    component: VersionRoutingComponent,
    children: [
      {
        path: '',
        component: VersionsManagerComponent
      },
      {
        path: ':id',
        component: VersionModelComponent
      },
      {
        path: ':id/audit',
        loadChildren: '../audit/audit.module#AuditModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(versionRoutes)],
  exports: [RouterModule]
})
export class VersionRoutingModule {}
