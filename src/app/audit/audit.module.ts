import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@app/core/core.module';
import { RouterModule } from '@angular/router';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditRoutingComponent } from './containers/audit-routing.component';
import { AuditManagerComponent } from './containers/audit/audit-manager.component';

@NgModule({
  imports: [AuditRoutingModule, RouterModule, FormsModule, ReactiveFormsModule, CommonModule, CoreModule],
  exports: [],
  declarations: [AuditRoutingComponent, AuditManagerComponent],
  providers: []
})
export class AuditModule {}
