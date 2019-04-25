import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditManagerComponent } from './containers/audit/audit-manager.component';
import { AuditRoutingComponent } from './containers/audit-routing.component';

export const auditRoutes: Routes = [
  {
    path: '',
    component: AuditRoutingComponent,
    children: [
      {
        path: '',
        component: AuditManagerComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(auditRoutes)],
  exports: [RouterModule]
})
export class AuditRoutingModule {}
