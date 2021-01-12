import { InstancesComponent } from './containers/instances.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InstancesRoutingModule } from './instances-routing.module';
import { CoreModule } from '@app/core/core.module';

@NgModule({
  imports: [
    CoreModule,
    CommonModule,
    InstancesRoutingModule
  ],
  declarations: [InstancesComponent]
})
export class InstancesModule {}
